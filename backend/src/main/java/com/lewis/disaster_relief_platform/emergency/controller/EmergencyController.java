/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.controller;

import com.lewis.disaster_relief_platform.common.dto.ApiResponse;
import com.lewis.disaster_relief_platform.common.dto.PageResponse;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyRequest;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyUpdateRequest;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyResponse;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyTrackingResponse;
import com.lewis.disaster_relief_platform.emergency.model.Status;
import com.lewis.disaster_relief_platform.emergency.repository.EmergencyRepository;
import com.lewis.disaster_relief_platform.emergency.service.EmergencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Emergency APIs", description = "All APIs related to Emergency: creation, updation, deletion and many more")
public class EmergencyController {
    private final EmergencyService emergencyService;
    private final EmergencyRepository emergencyRepository;

    /**
     * Create a new Emergency
     * POST /api/v1/emergencies
     */
    @PostMapping("/public/requests")
    @Operation(summary = "Create a new emergency for PUBLIC", description = "Submits a new emergency request and saves it to the database.")
    public ResponseEntity<ApiResponse<EmergencyResponse>> createPublicEmergency(
            @Valid @RequestBody EmergencyRequest request) {
        log.info("event=EMERGENCY_CREATE_REQUEST type={} affectedPeople={}",
                request.getType(),
                request.getAffectedPeople());
        try {

            long startTime = System.currentTimeMillis();

            EmergencyResponse response = emergencyService.CreateEmergency(request);

            long duration = System.currentTimeMillis() - startTime;

            log.info("event=EMERGENCY_CREATED trackingCode={} durationMs={} status=SUCCESS",
                    response.getTrackingCode(),
                    duration);

            String message = String.format(
                    "Emergency created successfully. Your tracking code is: %s. Save this code to check your request status.",
                    response.getTrackingCode());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(response, message));

        } catch (Exception e) {

            log.error("event=EMERGENCY_CREATE_FAILED status=ERROR message={}",
                    e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Track emergency by code (PUBLIC - no auth required)
     * GET /api/v1/emergencies/track/{trackingCode}
     */
    @GetMapping("/public/track/{trackingCode}")
    public ResponseEntity<ApiResponse<EmergencyTrackingResponse>> trackEmergency(
            @PathVariable String trackingCode) {
        log.info("event=EMERGENCY_TRACK_REQUEST trackingCode={}", trackingCode);
        EmergencyTrackingResponse response = emergencyService.trackByCode(trackingCode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EmergencyResponse>> createEmergency(
            @Valid @RequestBody EmergencyRequest request) {
        // For logged-in users (volunteers, admins)
        log.info("Authenticated user creating emergency");
        EmergencyResponse response = emergencyService.CreateEmergency(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Emergency created"));
    }

    /**
     * Get all emergencies with pagination and sorting
     * GET /api/v1/emergencies?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
    @Operation(summary = "Get all emergencies", description = "Fetches a paginated list of all emergencies with support for sorting by fields like 'affectedPeople' or 'createdAt'.")
    public ResponseEntity<ApiResponse<PageResponse<EmergencyResponse>>> getAllEmergencies(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "affectedPeople") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        log.info("event=FETCH_EMERGENCIES page={} size={} sortBy={}",
                page, size, sortBy);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        log.info("DIrection:: {}", direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<EmergencyResponse> emergencies = emergencyService.getAllEmergencies(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(emergencies)));
    }

    @GetMapping("/visible")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get emergencies visible to the current user", description = "Admins and coordinators see all emergencies, volunteers see assigned requests, and organization users see requests they submitted.")
    public ResponseEntity<ApiResponse<PageResponse<EmergencyResponse>>> getVisibleEmergencies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<EmergencyResponse> emergencies = emergencyService.getVisibleEmergencies(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(emergencies)));
    }

    /*
     * Get Emergency By Id.
     * GET /api/v1/emergencies/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get emergency by ID", description = "Retrieves the detailed information of a specific emergency using its unique identifier.")
    public ResponseEntity<ApiResponse<EmergencyResponse>> getEmergencyById(@PathVariable String id) {
        log.info("Fetching emergency with id: {}", id);
        EmergencyResponse emergencyById = emergencyService.getEmergencyById(id);
        return ResponseEntity.ok(ApiResponse.success(emergencyById));
    }

    /**
     * Update Emergency (assign, change status, add notes)
     * PUT /api/v1/emergencies/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update emergency", description = "Updates an emergency record — assignee, status, notes, etc.")
    public ResponseEntity<ApiResponse<EmergencyResponse>> updateEmergency(
            @PathVariable String id,
            @RequestBody EmergencyUpdateRequest request) {
        log.info("event=EMERGENCY_UPDATE emergencyId={} status={} volunteerId={}",
                id,
                request.getStatus(),
                request.getAssignedTo());
        EmergencyResponse response = emergencyService.updateEmergency(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Emergency updated successfully"));
    }

    /**
     * Update Emergency Status
     * PATCH /api/v1/emergencies/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update emergency status", description = "Updates the current status (e.g., PENDING, IN_PROGRESS, RESOLVED) of a specific emergency.")
    public ResponseEntity<ApiResponse<EmergencyResponse>> updateEmergencyStatus(@PathVariable String id,
            @RequestParam Status status) {
       log.info("event=EMERGENCY_STATUS_UPDATE emergencyId={} newStatus={}",
                id, status);
        EmergencyResponse response = emergencyService.updateEmergencyStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(response, "Emergency Status updated successfully. "));
    }

    /**
     * Assign volunteer to emergency
     * PATCH /api/v1/emergencies/{id}/assign
     */
    @PatchMapping("/{emergencyId}/{volunteerId}")
    @Operation(summary = "Assign volunteer to emergency", description = "Links a specific volunteer to an emergency record to begin the relief process.")
    public ResponseEntity<ApiResponse<EmergencyResponse>> assignVolunteer(@PathVariable String emergencyId,
            @PathVariable String volunteerId) {
        EmergencyResponse assignedVolunteer = emergencyService.assignVolunteer(emergencyId, volunteerId);
        return ResponseEntity.ok(ApiResponse.success(assignedVolunteer, "Volunteer assigned successfully"));
    }

    /**
     * Delete emergency
     * DELETE /api/v1/emergencies/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete emergency", description = "Permanently removes an emergency record from the system using its ID.")
    public ResponseEntity<ApiResponse<Void>> deleteEmergency(@PathVariable String id) {
        emergencyService.deleteEmergency(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Emergency deleted successfully"));
    }

    /**
     * Get Emergency Statistics
     * GET /api/v1/emergencies/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
    @Operation(summary = "Get emergency statistics", description = "Retrieves a count of emergencies grouped by their current status (Total, Pending, Resolved, etc.).")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatistics() {
        log.info("Fetching emergency statistics");
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", emergencyService.getTotalEmergencies());
        stats.put("pending", emergencyService.getPendingEmergenciesCount());
        stats.put("resolved", emergencyService.getEmergenciesByStatus(Status.RESOLVED));
        stats.put("in_progress", emergencyService.getEmergenciesByStatus(Status.IN_PROGRESS));
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
