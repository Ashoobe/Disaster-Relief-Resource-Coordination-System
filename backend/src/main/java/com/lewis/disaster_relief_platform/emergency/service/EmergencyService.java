/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.service;

import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.common.dto.EmergencyFilterRequest;
import com.lewis.disaster_relief_platform.common.exception.domain.BusinessException;
import com.lewis.disaster_relief_platform.common.exception.domain.ResourceNotFoundException;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyRequest;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyStatusUpdateRequest;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyResponse;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyTrackingResponse;
import com.lewis.disaster_relief_platform.emergency.kafka.EmergencyEventPublisher;
import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import com.lewis.disaster_relief_platform.emergency.model.Location;
import com.lewis.disaster_relief_platform.emergency.model.Status;
import com.lewis.disaster_relief_platform.emergency.repository.EmergencyRepository;
import com.lewis.disaster_relief_platform.notification.AdminAlertEmailService;
import com.lewis.disaster_relief_platform.notification.service.AppNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class EmergencyService {
    private final EmergencyRepository emergencyRepository;
    private final EmergencyEventPublisher emergencyEventPublisher;
    private final UserRepository userRepository;
    private final AppNotificationService notificationService;
    private final AdminAlertEmailService adminAlertEmailService;


    @Transactional
    @CacheEvict(value = {"emergencies", "stats"}, allEntries = true)
    public EmergencyResponse CreateEmergency(EmergencyRequest request) {
        log.info("Creating new emergency: {}", request.getTitle());
        validateEmergencyRequest(request);
        String currentUserId = getCurrentUserId();
        boolean isAuthenticated = currentUserId != null;

        String trackingCode = generateTrackingCode();
        Status initialStatus = isAuthenticated ? Status.PENDING : Status.PENDING_VERIFICATION;

        Location location = Location.builder().latitude(request.getLocation().getLatitude()).longitude(request.getLocation().getLongitude()).address(request.getLocation().getAddress()).city(request.getLocation().getCity()).state(request.getLocation().getState()).zipCode(request.getLocation().getZipCode()).country(request.getLocation().getCountry()).build();

        Emergency emergency = Emergency.builder().trackingCode(trackingCode).title(request.getTitle()).description(request.getDescription()).type(request.getType()).priority(request.getPriority()).status(initialStatus).location(location).reportedBy(request.getReportedBy()).reportedByEmail(request.getContactEmail()).contactPhone(request.getContactPhone()).contactEmail(request.getContactEmail()).affectedPeople(request.getAffectedPeople()).requiredResources(request.getRequiredResources()).createdByUserId(currentUserId)  // NULL if public
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();


        log.info("FROM SERVICE: ", emergency);
        Emergency savedEmergency = emergencyRepository.save(emergency);
        // Notify the configured Gmail/admin inbox after MongoDB saves the request so staff can respond quickly without risking data loss if email fails.
        adminAlertEmailService.sendNewRequestAlert(savedEmergency);
        emergencyEventPublisher.publishEmergencyCreated(savedEmergency);
        emergencyEventPublisher.publishTrackingCodeEmail(savedEmergency);
        log.info("Emergency saved with ID: {}", savedEmergency.getId());
        return EmergencyResponse.fromEntity(savedEmergency);
    }

    @Cacheable(value = "tracking", key = "#trackingCode", unless = "#result == null")
    public EmergencyTrackingResponse trackByCode(String trackingCode) {
        log.info("Tracking emergency with code: {}", trackingCode);

        Emergency emergency = emergencyRepository.findByTrackingCode(trackingCode).orElseThrow(() -> new ResourceNotFoundException("Emergency", "trackingCode", trackingCode));
        return EmergencyTrackingResponse.fromEntity(emergency);
    }

    public Page<EmergencyResponse> getMyEmergencies(Pageable pageable) {
        String userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("User must be authenticated to view their emergencies");
        }
        log.info("Fetching emergencies for user: {}", userId);
        Page<Emergency> emergencies = emergencyRepository.findByCreatedByUserId(userId, pageable);
        return emergencies.map(EmergencyResponse::fromEntity);
    }

    public Page<EmergencyResponse> getAssignedToCurrentVolunteer(Pageable pageable) {
        User currentUser = getCurrentUser();
        log.info("Fetching assigned emergencies for volunteer user: {}", currentUser.getId());
        // Assignment records are stored in MongoDB by user id, so this query keeps the volunteer view tied to persisted assignments.
        Page<Emergency> emergencies = emergencyRepository.findByAssignedVolunteerId(currentUser.getId(), pageable);
        return emergencies.map(EmergencyResponse::fromEntity);
    }


    public void linkEmergenciesToUser(String userId, String email) {
        log.info("Linking emergencies to user {} with email {}", userId, email);
        List<Emergency> unlinkedEmergencies = emergencyRepository.findByReportedByEmailAndCreatedByUserIdIsNull(email);

        if (unlinkedEmergencies.isEmpty()) {
            log.info("No unlinked emergencies found for email: {}", email);
            return;
        }

        for (Emergency emergency : unlinkedEmergencies) {
            emergency.setCreatedByUserId(userId);
            emergency.setStatus(Status.PENDING);  // Upgrade from PENDING_VERIFICATION
            emergencyRepository.save(emergency);
        }
        log.info("Linked {} emergencies to user {}", unlinkedEmergencies.size(), userId);
    }


    public Page<EmergencyResponse> getAllEmergencies(Pageable pageable) {
        log.info("Fetching emergencies - Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<Emergency> emergencies = emergencyRepository.findAll(pageable);
        log.info("FROM SERVICE:{}", emergencies);
        return emergencies.map(emergency -> EmergencyResponse.fromEntity(emergency));
    }

    public Page<EmergencyResponse> searchEmergencies(EmergencyFilterRequest filter, Pageable pageable) {
        log.info("Searching emergencies with filter {}", filter);
        Page<Emergency> emergencies;
        if (filter.getKeyword() != null && !filter.getKeyword().isEmpty()) {
            emergencies = emergencyRepository.searchByKeyword(filter.getKeyword(), pageable);
        } else if (filter.getStatus() != null && filter.getPriority() != null) {
            emergencies = emergencyRepository.findByStatusAndPriority(filter.getStatus(), filter.getPriority(), pageable);
        } else if (filter.getStatus() != null) {
            emergencies = emergencyRepository.findByStatus(filter.getStatus(), pageable);
        } else if (filter.getType() != null) {
            emergencies = emergencyRepository.findByType(filter.getType(), pageable);
        } else if (filter.getPriority() != null) {
            emergencies = emergencyRepository.findByPriority(filter.getPriority(), pageable);
        } else if (filter.getZipCode() != null) {
            emergencies = emergencyRepository.findByLocationZipCode(filter.getZipCode(), pageable);
        } else if (filter.getCity() != null) {
            emergencies = emergencyRepository.findByLocationCity(filter.getCity(), pageable);
        } else if (filter.getCreatedAfter() != null && filter.getCreatedBefore() != null) {
            emergencies = emergencyRepository.findByCreatedAtBetween(filter.getCreatedAfter(), filter.getCreatedBefore(), pageable);
        } else {
            emergencies = emergencyRepository.findAll(pageable);
        }
        return emergencies.map(emergency -> EmergencyResponse.fromEntity(emergency));
    }

    public EmergencyResponse getEmergencyById(String id) {
        // Do not cache this by id only because volunteers can view details only when MongoDB assigns the request to them.
        Emergency emergency = emergencyRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));
        ensureCurrentUserCanView(emergency);
        return EmergencyResponse.fromEntity(emergency);
    }


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "emergencies", key = "#id"),
            @CacheEvict(value = "stats", allEntries = true)
    })
    public EmergencyResponse updateEmergencyStatus(String id, Status newStatus) {
        return applyEmergencyStatusUpdate(id, EmergencyStatusUpdateRequest.builder().status(newStatus).build());
    }


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "emergencies", key = "#id"),
            @CacheEvict(value = "stats", allEntries = true)
    })
    public EmergencyResponse updateEmergencyProgress(String id, EmergencyStatusUpdateRequest request) {
        return applyEmergencyStatusUpdate(id, request);
    }

    private EmergencyResponse applyEmergencyStatusUpdate(String id, EmergencyStatusUpdateRequest request) {
        Emergency emergency = emergencyRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));
        Status newStatus = request.getStatus();
        User currentUser = ensureCurrentUserCanUpdate(emergency, newStatus);
        validateStatusTransition(emergency.getStatus(), newStatus);

        emergency.setStatus(newStatus);
        emergency.setUpdatedAt(LocalDateTime.now());
        if (newStatus == Status.RESOLVED) {
            emergency.setResolvedAt(LocalDateTime.now());
            emergency.setCompletionNotes(request.getCompletionNotes());
            emergency.setCompletedBy(resolveCompletedBy(request, currentUser));
            emergency.setCompletedByUserId(currentUser.getId());
        }
        Emergency updatedEmergency = emergencyRepository.save(emergency);
        emergencyEventPublisher.publishStatusUpdated(updatedEmergency);
        if (newStatus == Status.RESOLVED) {
            // Completion notifications are saved in MongoDB so admins and the assigned volunteer stay synchronized across sessions.
            notificationService.createCompletionNotification(updatedEmergency, updatedEmergency.getCompletedBy());
        }
        return EmergencyResponse.fromEntity(updatedEmergency);
    }


    @Transactional
    public EmergencyResponse assignVolunteer(String emergencyId, String volunteerId) {
        log.info("Assigning volunteer {} to emergency {}", volunteerId, emergencyId);

        Emergency emergency = emergencyRepository.findById(emergencyId).orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", emergencyId));
        User volunteer = userRepository.findById(volunteerId).orElseThrow(() -> new ResourceNotFoundException("User", "id", volunteerId));
        if (volunteer.getRole() == null || !volunteer.getRole().contains(Role.VOLUNTEER)) {
            throw new BusinessException("Emergency can only be assigned to a volunteer user");
        }

        if (emergency.getStatus() != Status.PENDING) {
            throw new BusinessException("Emergency must be in PENDING status to assign volunteers");
        }

        // Persist the real MongoDB volunteer user id so the volunteer task screen can load this request after login.
        emergency.setAssignedVolunteerId(volunteerId);
        emergency.setStatus(Status.ASSIGNED);
        emergency.setUpdatedAt(LocalDateTime.now());
        Emergency updated = emergencyRepository.save(emergency);
        emergencyEventPublisher.publishVolunteerAssigned(updated, volunteerId);
        notificationService.createAssignmentNotification(updated, volunteer);
        return EmergencyResponse.fromEntity(updated);
    }

    public void deleteEmergency(String id) {
        log.info("Attempting to delete emergency: {}", id);
        // Use findById only if you need to perform logic based on the object's state
        // before it's gone (e.g., "Cannot delete an emergency that is IN_PROGRESS")
        Emergency emergency = emergencyRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));

        // Example of why findById is better than existsById:
        if (emergency.getStatus() == Status.IN_PROGRESS) {
            throw new BusinessException("Cannot delete an emergency that is currently in progress");
        }
        emergencyRepository.deleteById(id);
        log.info("Emergency {} deleted successfully", id);
    }


    //statistics method
    @Cacheable(value = "stats", key = "'total'")
    public long getTotalEmergencies() {
        return emergencyRepository.count();
    }

    public long getPendingEmergenciesCount() {
        return emergencyRepository.countPendingEmergencies();
    }

    public long getEmergenciesByStatus(Status status) {
        return emergencyRepository.countByStatus(status);
    }

    private void validateEmergencyRequest(EmergencyRequest request) {
        if (request.getAffectedPeople() != null && request.getAffectedPeople() < 0) {
            throw new BusinessException("Affected people count cannot be negative");
        }

        Double latitude = request.getLocation().getLatitude();
        if (latitude != null && (latitude < -90 || latitude > 90)) {
            throw new BusinessException("Invalid latitude value");
        }

        Double longitude = request.getLocation().getLongitude();
        if (longitude != null && (longitude < -180 || longitude > 180)) {
            throw new BusinessException("Invalid longitude value");
        }
    }

    private void validateStatusTransition(Status currentStatus, Status newStatus) {
        if (newStatus == null) {
            throw new BusinessException("Status is required");
        }

        // BUsiness rules for status transitions
        if (currentStatus == Status.RESOLVED && newStatus != Status.RESOLVED) {
            throw new BusinessException("Cannot Change Status of Resolved emergency.");
        }
        if (currentStatus == Status.CANCELLED) {
            throw new BusinessException("Cannot change status of cancelled emergency");
        }
    }

    private User ensureCurrentUserCanUpdate(Emergency emergency, Status newStatus) {
        User currentUser = getCurrentUser();
        if (hasCurrentRole("ROLE_ADMIN") || hasCurrentRole("ROLE_COORDINATOR")) {
            return currentUser;
        }

        if (hasCurrentRole("ROLE_VOLUNTEER") && currentUser.getId().equals(emergency.getAssignedVolunteerId())) {
            if (newStatus == Status.IN_PROGRESS || newStatus == Status.RESOLVED) {
                return currentUser;
            }
            throw new AccessDeniedException("Volunteers can only start or complete requests assigned to their account");
        }

        // Status updates must use the persisted MongoDB assignment so admins and volunteers see the same task state.
        throw new AccessDeniedException("You can only update emergencies assigned to your account");
    }

    private String resolveCompletedBy(EmergencyStatusUpdateRequest request, User currentUser) {
        if (request.getCompletedBy() != null && !request.getCompletedBy().isBlank()) {
            return request.getCompletedBy();
        }
        if (currentUser.getFullName() != null && !currentUser.getFullName().isBlank()) {
            return currentUser.getFullName();
        }
        return currentUser.getUsername();
    }

    private String generateTrackingCode() {
        String prefix = "DISASTER-" + LocalDate.now().getYear() + "-";
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return prefix + randomPart;
    }

    private User getCurrentUser() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new BusinessException("User must be authenticated");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        return authentication.getName();
    }

    private boolean hasCurrentRole(String roleName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(roleName));
    }

    private void ensureCurrentUserCanView(Emergency emergency) {
        if (hasCurrentRole("ROLE_ADMIN") || hasCurrentRole("ROLE_COORDINATOR")) {
            return;
        }

        if (hasCurrentRole("ROLE_VOLUNTEER")) {
            User currentUser = getCurrentUser();
            if (currentUser.getId().equals(emergency.getAssignedVolunteerId())) {
                return;
            }
        }

        // Volunteers can open request details only after MongoDB shows the request is assigned to them.
        throw new AccessDeniedException("You can only view emergencies assigned to your account");
    }

    private String getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            return authentication.getName();

        } catch (Exception e) {
            log.debug("No authenticated user found");
            return null;
        }
    }

}
