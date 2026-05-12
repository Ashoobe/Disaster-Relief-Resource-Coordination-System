/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.controller;


import com.lewis.disaster_relief_platform.common.dto.ApiResponse;
import com.lewis.disaster_relief_platform.common.dto.PageResponse;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.RegisterVolunteerRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.UpdateVolunteerRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.requests.VolunteerFilterRequest;
import com.lewis.disaster_relief_platform.volunteer.dto.response.VolunteerResponse;
import com.lewis.disaster_relief_platform.volunteer.model.AvailabilityStatus;
import com.lewis.disaster_relief_platform.volunteer.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class VolunteerController {

    private final VolunteerService volunteerService;

    /**
     * Register as volunteer (PUBLIC or AUTHENTICATED)
     * POST /api/v1/volunteers
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<VolunteerResponse>> registerVolunteer(
            @Valid @RequestBody RegisterVolunteerRequest request) {

        log.info("Volunteer registration request: {}", request.getName());
        VolunteerResponse response = volunteerService.registerVolunteer(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Volunteer registered successfully"));
    }

    /**
     * Get my volunteer profile (AUTHENTICATED)
     * GET /api/v1/volunteers/me
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VolunteerResponse>> getMyProfile() {
        log.info("Fetching current volunteer profile");
        VolunteerResponse response = volunteerService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get all volunteers (COORDINATOR/ADMIN only)
     * GET /api/v1/volunteers
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<VolunteerResponse>>> getAllVolunteers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registeredAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        log.info("Fetching all volunteers");

        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<VolunteerResponse> volunteers = volunteerService.getAllVolunteers(pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(volunteers)));
    }

    /**
     * Search volunteers (COORDINATOR/ADMIN only)
     * POST /api/v1/volunteers/search
     */
    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<VolunteerResponse>>> searchVolunteers(
            @RequestBody VolunteerFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Searching volunteers with filters");

        Pageable pageable = PageRequest.of(page, size);
        Page<VolunteerResponse> volunteers = volunteerService.searchVolunteers(filter, pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(volunteers)));
    }

    /**
     * Get volunteer by ID (COORDINATOR/ADMIN only)
     * GET /api/v1/volunteers/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<VolunteerResponse>> getVolunteerById(@PathVariable String id) {
        log.info("Fetching volunteer: {}", id);
        VolunteerResponse response = volunteerService.getVolunteerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Update volunteer profile
     * PUT /api/v1/volunteers/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VolunteerResponse>> updateVolunteer(
            @PathVariable String id,
            @Valid @RequestBody UpdateVolunteerRequest request) {

        log.info("Updating volunteer: {}", id);
        VolunteerResponse response = volunteerService.updateVolunteer(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Volunteer profile updated successfully")
        );
    }

    /**
     * Update availability status
     * PATCH /api/v1/volunteers/{id}/availability
     */
    @PatchMapping("/{id}/availability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VolunteerResponse>> updateAvailability(
            @PathVariable String id,
            @RequestParam AvailabilityStatus status) {

        log.info("Updating volunteer {} availability to {}", id, status);
        VolunteerResponse response = volunteerService.updateAvailability(id, status);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Availability updated successfully")
        );
    }

    /**
     * Delete volunteer (ADMIN only)
     * DELETE /api/v1/volunteers/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVolunteer(@PathVariable String id) {
        log.info("Deleting volunteer: {}", id);
        volunteerService.deleteVolunteer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Volunteer deleted successfully"));
    }

    /**
     * Get volunteer statistics (COORDINATOR/ADMIN only)
     * GET /api/v1/volunteers/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatistics() {
        log.info("Fetching volunteer statistics");

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", volunteerService.getTotalVolunteers());
        stats.put("available", volunteerService.getAvailableVolunteersCount());
        stats.put("verified", volunteerService.getVerifiedVolunteersCount());

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}