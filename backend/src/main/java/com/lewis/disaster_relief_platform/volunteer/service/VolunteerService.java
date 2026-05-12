/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.service;

import com.lewis.disaster_relief_platform.common.exception.domain.BusinessException;
import com.lewis.disaster_relief_platform.common.exception.domain.ResourceNotFoundException;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.RegisterVolunteerRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.UpdateVolunteerRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.VolunteerFilterRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.response.VolunteerResponse;
import com.lewis.disaster_relief_platform.volunteer.model.AvailabilityStatus;
import com.lewis.disaster_relief_platform.volunteer.model.Location;
import com.lewis.disaster_relief_platform.volunteer.model.Volunteer;
import com.lewis.disaster_relief_platform.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    @Transactional
    @CacheEvict(value = "volunteers", allEntries = true)
    public VolunteerResponse registerVolunteer(RegisterVolunteerRequest request) {
        log.info("Registering new volunteer: {}", request.getName());

        // Check if volunteer already exists
        if (volunteerRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Volunteer already registered with email: " + request.getEmail());
        }

        // Get current user ID (if authenticated)
        String userId = getCurrentUserId();

        if (userId != null && volunteerRepository.existsByUserId(userId)) {
            throw new BusinessException("User already has a volunteer profile");
        }

        Location location = Location.builder()
                .latitude(request.getLocation().getLatitude())
                .longitude(request.getLocation().getLongitude())
                .address(request.getLocation().getAddress())
                .city(request.getLocation().getCity())
                .state(request.getLocation().getState())
                .country(request.getLocation().getCountry())
                .build();

        Volunteer volunteer = Volunteer.builder()
                .userId(userId)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .skills(request.getSkills())
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .location(location)
                .verified(false)
                .completedAssignments(0)
                .activeAssignments(0)
                .rating(5.0)
                .preferredEmergencyTypes(request.getPreferredEmergencyTypes())
                .maxTravelDistanceKm(request.getMaxTravelDistanceKm() != null ? request.getMaxTravelDistanceKm() : 50)
                .registeredAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .lastActiveAt(LocalDateTime.now())
                .build();

        Volunteer saved = volunteerRepository.save(volunteer);
        log.info("Volunteer registered with ID: {}", saved.getId());

        return VolunteerResponse.fromEntity(saved);
    }

    public Page<VolunteerResponse> getAllVolunteers(Pageable pageable) {
        log.info("Fetching all volunteers");
        Page<Volunteer> volunteers = volunteerRepository.findAll(pageable);
        return volunteers.map(VolunteerResponse::fromEntity);
    }

    public Page<VolunteerResponse> searchVolunteers(VolunteerFilterRequest filter, Pageable pageable) {
        log.info("Searching volunteers with filters: {}", filter);

        Page<Volunteer> volunteers;

        if (filter.getSkill() != null) {
            volunteers = volunteerRepository.findBySkillsContaining(filter.getSkill(), pageable);
        } else if (filter.getAvailabilityStatus() != null) {
            volunteers = volunteerRepository.findByAvailabilityStatus(filter.getAvailabilityStatus(), pageable);
        } else if (filter.getCity() != null) {
            volunteers = volunteerRepository.findByLocationCity(filter.getCity(), pageable);
        } else if (filter.getVerifiedOnly() != null && filter.getVerifiedOnly()) {
            volunteers = volunteerRepository.findByVerified(true, pageable);
        } else {
            volunteers = volunteerRepository.findAll(pageable);
        }

        return volunteers.map(VolunteerResponse::fromEntity);
    }

    @Cacheable(value = "volunteers", key = "#id", unless = "#result == null")
    public VolunteerResponse getVolunteerById(String id) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer", "id", id));
        return VolunteerResponse.fromEntity(volunteer);
    }

    public VolunteerResponse getMyProfile() {
        String userId = getCurrentUserId();

        if (userId == null) {
            throw new BusinessException("User must be authenticated");
        }

        Volunteer volunteer = volunteerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer profile not found for user: " + userId));

        return VolunteerResponse.fromEntity(volunteer);
    }

    @Transactional
    @CacheEvict(value = "volunteers", key = "#id")
    public VolunteerResponse updateVolunteer(String id, UpdateVolunteerRequest request) {
        log.info("Updating volunteer: {}", id);

        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer", "id", id));

        // Authorization check: Users can only update their own profile
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && !currentUserId.equals(volunteer.getUserId())) {
            throw new BusinessException("You can only update your own profile");
        }

        if (request.getName() != null) volunteer.setName(request.getName());
        if (request.getPhone() != null) volunteer.setPhone(request.getPhone());
        if (request.getSkills() != null) volunteer.setSkills(request.getSkills());
        if (request.getAvailabilityStatus() != null) volunteer.setAvailabilityStatus(request.getAvailabilityStatus());
        if (request.getPreferredEmergencyTypes() != null) volunteer.setPreferredEmergencyTypes(request.getPreferredEmergencyTypes());
        if (request.getMaxTravelDistanceKm() != null) volunteer.setMaxTravelDistanceKm(request.getMaxTravelDistanceKm());

        if (request.getLocation() != null) {
            Location location = Location.builder()
                    .latitude(request.getLocation().getLatitude())
                    .longitude(request.getLocation().getLongitude())
                    .address(request.getLocation().getAddress())
                    .city(request.getLocation().getCity())
                    .state(request.getLocation().getState())
                    .country(request.getLocation().getCountry())
                    .build();
            volunteer.setLocation(location);
        }

        volunteer.setUpdatedAt(LocalDateTime.now());
        volunteer.setLastActiveAt(LocalDateTime.now());

        Volunteer updated = volunteerRepository.save(volunteer);
        return VolunteerResponse.fromEntity(updated);
    }

    @Transactional
    @CacheEvict(value = "volunteers", key = "#id")
    public VolunteerResponse updateAvailability(String id, AvailabilityStatus status) {
        log.info("Updating volunteer {} availability to {}", id, status);

        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer", "id", id));

        volunteer.setAvailabilityStatus(status);
        volunteer.setUpdatedAt(LocalDateTime.now());
        volunteer.setLastActiveAt(LocalDateTime.now());

        Volunteer updated = volunteerRepository.save(volunteer);
        return VolunteerResponse.fromEntity(updated);
    }

    @Transactional
    public void incrementActiveAssignments(String volunteerId) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer", "id", volunteerId));

        volunteer.setActiveAssignments(volunteer.getActiveAssignments() + 1);
        volunteer.setAvailabilityStatus(AvailabilityStatus.ON_ASSIGNMENT);
        volunteer.setUpdatedAt(LocalDateTime.now());

        volunteerRepository.save(volunteer);
    }

    @Transactional
    public void completeAssignment(String volunteerId) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer", "id", volunteerId));

        volunteer.setActiveAssignments(Math.max(0, volunteer.getActiveAssignments() - 1));
        volunteer.setCompletedAssignments(volunteer.getCompletedAssignments() + 1);

        if (volunteer.getActiveAssignments() == 0) {
            volunteer.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        }

        volunteer.setUpdatedAt(LocalDateTime.now());
        volunteerRepository.save(volunteer);
    }

    @Transactional
    @CacheEvict(value = "volunteers", key = "#id")
    public void deleteVolunteer(String id) {
        if (!volunteerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Volunteer", "id", id);
        }

        volunteerRepository.deleteById(id);
        log.info("Volunteer deleted: {}", id);
    }

    // Statistics
    public long getTotalVolunteers() {
        return volunteerRepository.count();
    }

    public long getAvailableVolunteersCount() {
        return volunteerRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE);
    }

    public long getVerifiedVolunteersCount() {
        return volunteerRepository.countByVerified(true);
    }

    private String getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return null;
            }
            return auth.getName();
        } catch (Exception e) {
            return null;
        }
    }
}
