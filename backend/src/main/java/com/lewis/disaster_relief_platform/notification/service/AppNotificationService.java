/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification.service;

import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.common.exception.domain.ResourceNotFoundException;
import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import com.lewis.disaster_relief_platform.notification.dto.AppNotificationRequest;
import com.lewis.disaster_relief_platform.notification.dto.AppNotificationResponse;
import com.lewis.disaster_relief_platform.notification.model.AppNotification;
import com.lewis.disaster_relief_platform.notification.repository.AppNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppNotificationService {
    private final AppNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public AppNotificationResponse create(AppNotificationRequest request) {
        AppNotification saved = notificationRepository.save(AppNotification.builder()
                .title(defaultString(request.getTitle(), "Notification"))
                .body(defaultString(request.getBody(), ""))
                .type(defaultString(request.getType(), "general"))
                .requestId(request.getRequestId())
                .trackingCode(request.getTrackingCode())
                .actionPath(request.getActionPath())
                .audience(defaultString(request.getAudience(), "all"))
                .roleAudience(normalizeRoles(request.getRoleAudience()))
                .recipientUserIds(nonNullList(request.getRecipientUserIds()))
                .recipientEmails(normalizeEmails(request.getRecipientEmails()))
                .readBy(List.of())
                .createdAt(LocalDateTime.now())
                .build());
        return AppNotificationResponse.fromEntity(saved, false);
    }

    public void createAssignmentNotification(Emergency emergency, User assignee) {
        List<String> recipientEmails = assignee.getEmail() == null || assignee.getEmail().isBlank()
                ? List.of()
                : List.of(assignee.getEmail());
        String assigneeName = assignee.getFullName() == null || assignee.getFullName().isBlank()
                ? assignee.getUsername()
                : assignee.getFullName();

        create(AppNotificationRequest.builder()
                .type("request_assigned")
                .requestId(emergency.getId())
                .trackingCode(emergency.getTrackingCode())
                .actionPath("/requests/" + emergency.getId())
                .title("Request Assigned")
                .body("Tracking ID " + getTrackingId(emergency) + " was assigned to " + assigneeName + ".")
                .audience("mixed")
                .roleAudience(List.of("admin", "coordinator", "organization_staff"))
                .recipientUserIds(List.of(assignee.getId()))
                .recipientEmails(recipientEmails)
                .build());
    }

    public void createCompletionNotification(Emergency emergency, String completedBy) {
        List<String> recipientIds = new ArrayList<>();
        List<String> recipientEmails = new ArrayList<>();
        if (emergency.getAssignedVolunteerId() != null) {
            recipientIds.add(emergency.getAssignedVolunteerId());
            userRepository.findById(emergency.getAssignedVolunteerId())
                    .map(User::getEmail)
                    .filter(email -> !email.isBlank())
                    .ifPresent(recipientEmails::add);
        }

        create(AppNotificationRequest.builder()
                .type("request_completed")
                .requestId(emergency.getId())
                .trackingCode(emergency.getTrackingCode())
                .actionPath("/requests/" + emergency.getId())
                .title("Request Completed")
                .body("Tracking ID " + getTrackingId(emergency) + " was marked completed by " + completedBy + ".")
                .audience("mixed")
                .roleAudience(List.of("admin", "coordinator", "organization_staff"))
                .recipientUserIds(recipientIds)
                .recipientEmails(recipientEmails)
                .build());
    }

    public List<AppNotificationResponse> getCurrentUserNotifications() {
        User currentUser = getCurrentUser();
        List<String> viewerKeys = getViewerKeys(currentUser);
        Set<String> roleKeys = currentUser.getRole().stream()
                .map(this::normalizeRole)
                .collect(Collectors.toSet());

        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(notification -> isVisible(notification, viewerKeys, roleKeys))
                .map(notification -> AppNotificationResponse.fromEntity(notification, isRead(notification, viewerKeys)))
                .toList();
    }

    public AppNotificationResponse markRead(String id) {
        User currentUser = getCurrentUser();
        List<String> viewerKeys = getViewerKeys(currentUser);
        AppNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        List<String> readBy = new ArrayList<>(nonNullList(notification.getReadBy()));
        for (String key : viewerKeys) {
            if (!readBy.contains(key)) {
                readBy.add(key);
            }
        }
        notification.setReadBy(readBy);
        AppNotification saved = notificationRepository.save(notification);
        return AppNotificationResponse.fromEntity(saved, true);
    }

    public List<AppNotificationResponse> markAllRead() {
        User currentUser = getCurrentUser();
        List<String> viewerKeys = getViewerKeys(currentUser);
        Set<String> roleKeys = currentUser.getRole().stream()
                .map(this::normalizeRole)
                .collect(Collectors.toSet());

        List<AppNotification> updated = notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(notification -> {
                    if (!isVisible(notification, viewerKeys, roleKeys)) {
                        return notification;
                    }

                    List<String> readBy = new ArrayList<>(nonNullList(notification.getReadBy()));
                    for (String key : viewerKeys) {
                        if (!readBy.contains(key)) {
                            readBy.add(key);
                        }
                    }
                    notification.setReadBy(readBy);
                    return notificationRepository.save(notification);
                })
                .toList();

        return updated.stream()
                .filter(notification -> isVisible(notification, viewerKeys, roleKeys))
                .map(notification -> AppNotificationResponse.fromEntity(notification, isRead(notification, viewerKeys)))
                .toList();
    }

    private boolean isVisible(AppNotification notification, List<String> viewerKeys, Set<String> roleKeys) {
        String audience = defaultString(notification.getAudience(), "all").toLowerCase(Locale.ROOT);
        boolean direct = hasDirectAccess(notification, viewerKeys);
        boolean role = hasRoleAccess(notification, roleKeys);

        return switch (audience) {
            case "all" -> true;
            case "direct" -> direct;
            case "roles" -> role;
            case "mixed" -> direct || role;
            default -> direct || role;
        };
    }

    private boolean hasDirectAccess(AppNotification notification, List<String> viewerKeys) {
        List<String> recipientIds = nonNullList(notification.getRecipientUserIds());
        List<String> recipientEmails = normalizeEmails(notification.getRecipientEmails());
        return viewerKeys.stream().anyMatch(key -> recipientIds.contains(key) || recipientEmails.contains(key));
    }

    private boolean hasRoleAccess(AppNotification notification, Set<String> roleKeys) {
        List<String> roles = normalizeRoles(notification.getRoleAudience());
        return roles.stream().anyMatch(roleKeys::contains);
    }

    private boolean isRead(AppNotification notification, List<String> viewerKeys) {
        List<String> readBy = nonNullList(notification.getReadBy());
        return viewerKeys.stream().anyMatch(readBy::contains);
    }

    private List<String> getViewerKeys(User user) {
        List<String> keys = new ArrayList<>();
        keys.add(user.getId());
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            keys.add(user.getEmail().trim().toLowerCase(Locale.ROOT));
        }
        return keys;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private String normalizeRole(Role role) {
        return role.name().toLowerCase(Locale.ROOT);
    }

    private List<String> normalizeRoles(List<String> roles) {
        return nonNullList(roles).stream()
                .map(role -> role.replace("ROLE_", "").trim().toLowerCase(Locale.ROOT))
                .filter(role -> !role.isBlank())
                .distinct()
                .toList();
    }

    private List<String> normalizeEmails(List<String> emails) {
        return nonNullList(emails).stream()
                .map(email -> email.trim().toLowerCase(Locale.ROOT))
                .filter(email -> !email.isBlank())
                .distinct()
                .toList();
    }

    private List<String> nonNullList(List<String> items) {
        return items == null ? List.of() : items;
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String getTrackingId(Emergency emergency) {
        return emergency.getTrackingCode() == null ? emergency.getId() : emergency.getTrackingCode();
    }
}
