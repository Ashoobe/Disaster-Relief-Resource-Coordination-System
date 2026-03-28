/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.service;

import com.lewis.disaster_relief_platform.common.dto.EmergencyFilterRequest;
import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.common.exception.domain.BusinessException;
import com.lewis.disaster_relief_platform.common.exception.domain.ResourceNotFoundException;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyRequest;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyUpdateRequest;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyResponse;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyTrackingResponse;
import com.lewis.disaster_relief_platform.emergency.kafka.EmergencyEventPublisher;
import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import com.lewis.disaster_relief_platform.emergency.model.Location;
import com.lewis.disaster_relief_platform.emergency.model.Status;
import com.lewis.disaster_relief_platform.emergency.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional
    public EmergencyResponse CreateEmergency(EmergencyRequest request) {
        log.info("Creating new emergency: {}", request.getTitle());
        validateEmergencyRequest(request);
        String currentUserId = getCurrentUserId();
        boolean isAuthenticated = currentUserId != null;

        String trackingCode = generateTrackingCode(request.getReportedBy());
        Status initialStatus = isAuthenticated ? Status.PENDING : Status.PENDING_VERIFICATION;

        Location location = Location.builder().latitude(request.getLocation().getLatitude())
                .longitude(request.getLocation().getLongitude()).address(request.getLocation().getAddress())
                .city(request.getLocation().getCity()).state(request.getLocation().getState())
                .zipCode(request.getLocation().getZipCode()).country(request.getLocation().getCountry()).build();

        Emergency emergency = Emergency.builder().trackingCode(trackingCode).title(request.getTitle())
                .description(request.getDescription()).type(request.getType()).disasterType(request.getDisasterType())
                .priority(request.getPriority())
                .status(initialStatus).location(location).reportedBy(request.getReportedBy())
                .reportedByEmail(request.getContactEmail()).contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail()).affectedPeople(request.getAffectedPeople())
                .requiredResources(request.getRequiredResources()).createdByUserId(currentUserId) // NULL if public
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();

        log.info("FROM SERVICE: ", emergency);
        Emergency savedEmergency = emergencyRepository.save(emergency);

        // TODO: Send tracking code via email
        // emailService.sendTrackingCode(request.getContactEmail(), trackingCode);

        emergencyEventPublisher.publishEmergencyCreated(savedEmergency);
        log.info("Emergency saved with ID: {}", savedEmergency.getId());
        return EmergencyResponse.fromEntity(savedEmergency);
    }

    public EmergencyTrackingResponse trackByCode(String trackingCode) {
        log.info("Tracking emergency with code: {}", trackingCode);

        Emergency emergency = emergencyRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "trackingCode", trackingCode));
        return EmergencyTrackingResponse.fromEntity(emergency);
    }

    public Page<EmergencyResponse> getMyEmergencies(Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            throw new BusinessException("User must be authenticated to view their emergencies");
        }
        log.info("Fetching emergencies for user: {}", currentUser.getUsername());
        Page<Emergency> emergencies = emergencyRepository.findVisibleForOrganizationUser(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                pageable);
        return emergencies.map(EmergencyResponse::fromEntity);
    }

    public Page<EmergencyResponse> getVisibleEmergencies(Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            throw new BusinessException("User must be authenticated to view emergencies");
        }

        Page<Emergency> emergencies;
        if (hasPrivilegedAccess(currentUser)) {
            emergencies = emergencyRepository.findAll(pageable);
        } else if (currentUser.getRole() != null && currentUser.getRole().contains(Role.VOLUNTEER)) {
            emergencies = emergencyRepository.findByAssignedVolunteerId(currentUser.getId(), pageable);
        } else {
            emergencies = emergencyRepository.findVisibleForOrganizationUser(
                    currentUser.getId(),
                    currentUser.getUsername(),
                    currentUser.getEmail(),
                    pageable);
        }

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
            emergency.setStatus(Status.PENDING); // Upgrade from PENDING_VERIFICATION
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
            emergencies = emergencyRepository.findByStatusAndPriority(filter.getStatus(), filter.getPriority(),
                    pageable);
        } else if (filter.getStatus() != null) {
            emergencies = emergencyRepository.findByStatus(filter.getStatus(), pageable);
        } else if (filter.getType() != null) {
            emergencies = emergencyRepository.findByType(filter.getType(), pageable);
        } else if (filter.getPriority() != null) {
            emergencies = emergencyRepository.findByPriority(filter.getPriority(), pageable);
        } else if (filter.getCity() != null) {
            emergencies = emergencyRepository.findByLocationCity(filter.getCity(), pageable);
        } else if (filter.getCreatedAfter() != null && filter.getCreatedBefore() != null) {
            emergencies = emergencyRepository.findByCreatedAtBetween(filter.getCreatedAfter(),
                    filter.getCreatedBefore(), pageable);
        } else {
            emergencies = emergencyRepository.findAll(pageable);
        }
        return emergencies.map(emergency -> EmergencyResponse.fromEntity(emergency));
    }

    public EmergencyResponse getEmergencyById(String id) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));
        authorizeEmergencyAccess(emergency, false);
        return EmergencyResponse.fromEntity(emergency);
    }

    @Transactional
    public EmergencyResponse updateEmergency(String id, EmergencyUpdateRequest req) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));
        authorizeEmergencyAccess(emergency, true);

        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            String normalized = req.getStatus().toUpperCase().replace("-", "_");
            // Frontend uses "completed" but backend enum uses RESOLVED
            if ("COMPLETED".equals(normalized))
                normalized = "RESOLVED";
            Status newStatus = Status.valueOf(normalized);
            validateStatusTransition(emergency.getStatus(), newStatus);
            emergency.setStatus(newStatus);
            if (newStatus == Status.RESOLVED) {
                emergency.setResolvedAt(LocalDateTime.now());
                emergency.setCompletedAt(LocalDateTime.now());
            }
        }
        if (req.getAssignedTo() != null) {
            emergency.setAssignedVolunteerId(req.getAssignedTo());
        }
        if (req.getAssigneeName() != null) {
            emergency.setAssigneeName(req.getAssigneeName());
        }
        String resolvedNotes = req.getNotes() != null ? req.getNotes() : req.getCompletionNotes();
        if (resolvedNotes != null) {
            emergency.setNotes(resolvedNotes);
        }
        if (req.getCompletedBy() != null) {
            emergency.setCompletedBy(req.getCompletedBy());
        }
        emergency.setUpdatedAt(LocalDateTime.now());
        Emergency saved = emergencyRepository.save(emergency);
        emergencyEventPublisher.publishStatusUpdated(saved);
        return EmergencyResponse.fromEntity(saved);
    }

    @Transactional
    public EmergencyResponse updateEmergencyStatus(String id, Status newStatus) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));
        authorizeEmergencyAccess(emergency, true);
        // business validation
        validateStatusTransition(emergency.getStatus(), newStatus);
        emergency.setStatus(newStatus);
        emergency.setUpdatedAt(LocalDateTime.now());
        if (newStatus == Status.RESOLVED) {
            emergency.setResolvedAt(LocalDateTime.now());
        }
        Emergency updatedEmergency = emergencyRepository.save(emergency);
        emergencyEventPublisher.publishStatusUpdated(updatedEmergency);
        return EmergencyResponse.fromEntity(updatedEmergency);
    }

    @Transactional
    public EmergencyResponse assignVolunteer(String emergencyId, String volunteerId) {
        log.info("Assigning volunteer {} to emergency {}", volunteerId, emergencyId);

        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", emergencyId));
        authorizeEmergencyAccess(emergency, true);
        if (emergency.getStatus() != Status.PENDING && emergency.getStatus() != Status.PENDING_VERIFICATION) {
            throw new BusinessException(
                    "Emergency must be in PENDING or PENDING_VERIFICATION status to assign volunteers");
        }

        emergency.setAssignedVolunteerId(volunteerId);
        emergency.setStatus(Status.ASSIGNED);
        emergency.setUpdatedAt(LocalDateTime.now());
        Emergency updated = emergencyRepository.save(emergency);
        emergencyEventPublisher.publishVolunteerAssigned(updated, volunteerId);
        return EmergencyResponse.fromEntity(updated);
    }

    public void deleteEmergency(String id) {
        log.info("Attempting to delete emergency: {}", id);
        // Use findById only if you need to perform logic based on the object's state
        // before it's gone (e.g., "Cannot delete an emergency that is IN_PROGRESS")
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency", "id", id));

        // Example of why findById is better than existsById:
        if (emergency.getStatus() == Status.IN_PROGRESS) {
            throw new BusinessException("Cannot delete an emergency that is currently in progress");
        }
        emergencyRepository.deleteById(id);
        log.info("Emergency {} deleted successfully", id);
    }

    // statistics method
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

        if (request.getLocation() == null) {
            throw new BusinessException("Location is required");
        }

        if (request.getLocation().getAddress() == null || request.getLocation().getAddress().isBlank()) {
            throw new BusinessException("Exact address is required");
        }

        if (request.getLocation().getCity() == null || request.getLocation().getCity().isBlank()) {
            throw new BusinessException("City is required");
        }

        if (request.getLocation().getLatitude() != null &&
                (request.getLocation().getLatitude() < -90 || request.getLocation().getLatitude() > 90)) {
            throw new BusinessException("Invalid latitude value");
        }

        if (request.getLocation().getLongitude() != null &&
                (request.getLocation().getLongitude() < -180 || request.getLocation().getLongitude() > 180)) {
            throw new BusinessException("Invalid longitude value");
        }
    }

    private void validateStatusTransition(Status currentStatus, Status newStatus) {
        // BUsiness rules for status transitions
        if (currentStatus == Status.RESOLVED && newStatus != Status.RESOLVED) {
            throw new BusinessException("Cannot Change Status of Resolved emergency.");
        }
        if (currentStatus == Status.CANCELLED) {
            throw new BusinessException("Cannot change status of cancelled emergency");
        }
    }

    private String generateTrackingCode(String reporterName) {
        String prefix = buildTrackingPrefix(reporterName) + "-" + LocalDate.now().getYear() + "-";
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return prefix + randomPart;
    }

    private String buildTrackingPrefix(String reporterName) {
        if (reporterName == null || reporterName.isBlank()) {
            return "REQUEST";
        }

        String normalizedName = reporterName.trim().replaceAll("[^A-Za-z0-9 ]", " ");
        String[] nameParts = normalizedName.split("\\s+");

        for (String namePart : nameParts) {
            if (!namePart.isBlank()) {
                String collapsed = namePart.replaceAll("[^A-Za-z0-9]", "");
                if (!collapsed.isBlank()) {
                    String sanitized = collapsed.length() > 12 ? collapsed.substring(0, 12) : collapsed;
                    return sanitized.toUpperCase();
                }
            }
        }

        return "REQUEST";
    }

    private User getAuthenticatedUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            String identifier = authentication.getName();
            return userRepository.findByUsername(identifier)
                    .or(() -> userRepository.findByEmail(identifier))
                    .orElse(null);

        } catch (Exception e) {
            log.debug("No authenticated user found");
            return null;
        }
    }

    private String getCurrentUserId() {
        User currentUser = getAuthenticatedUser();
        return currentUser != null ? currentUser.getId() : null;
    }

    private boolean hasPrivilegedAccess(User currentUser) {
        return currentUser != null
                && currentUser.getRole() != null
                && (currentUser.getRole().contains(Role.ADMIN) || currentUser.getRole().contains(Role.COORDINATOR));
    }

    private void authorizeEmergencyAccess(Emergency emergency, boolean allowVolunteerUpdate) {
        User currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            throw new BusinessException("User must be authenticated to access emergencies");
        }

        if (hasPrivilegedAccess(currentUser)) {
            return;
        }

        boolean isAssignedVolunteer = currentUser.getRole() != null
                && currentUser.getRole().contains(Role.VOLUNTEER)
                && currentUser.getId().equals(emergency.getAssignedVolunteerId());
        boolean isOwner = currentUser.getId().equals(emergency.getCreatedByUserId())
                || currentUser.getUsername().equals(emergency.getCreatedByUserId())
                || currentUser.getEmail().equalsIgnoreCase(emergency.getContactEmail() != null ? emergency.getContactEmail() : "")
                || currentUser.getEmail().equalsIgnoreCase(emergency.getReportedByEmail() != null ? emergency.getReportedByEmail() : "");

        if (allowVolunteerUpdate && isAssignedVolunteer) {
            return;
        }

        if (!allowVolunteerUpdate && (isAssignedVolunteer || isOwner)) {
            return;
        }

        throw new BusinessException("You do not have permission to access this emergency");
    }

}
