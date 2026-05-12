/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.dto.response;

import com.lewis.disaster_relief_platform.emergency.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyResponse {
    private String id;
    private String trackingCode;
    private String title;
    private String description;
    private EmergencyType type;
    private Priority priority;
    private Status status;
    private Location location;
    private String reportedBy;
    private String contactPhone;
    private String contactEmail;
    private Integer affectedPeople;
    private String createdByUserId;  // ← ADD THIS (null if public)
    private String assignedVolunteerId;
    private String completionNotes;
    private String completedBy;
    private String completedByUserId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;


    // Factory Method to convert from Emergency entity
    public static EmergencyResponse fromEntity(Emergency emergency) {
        return EmergencyResponse.builder().
                id(emergency.getId()).
                trackingCode(emergency.getTrackingCode())
                .title(emergency.getTitle())
                .description(emergency.getDescription())
                .type(emergency.getType())
                .priority(emergency.getPriority())
                .status(emergency.getStatus())
                .location(emergency.getLocation())
                .reportedBy(emergency.getReportedBy())
                .contactPhone(emergency.getContactPhone())
                .contactEmail(emergency.getContactEmail())
                .affectedPeople(emergency.getAffectedPeople())
                .createdByUserId(emergency.getCreatedByUserId())
                // Expose the assigned volunteer id so the frontend can match MongoDB assignments to the logged-in volunteer.
                .assignedVolunteerId(emergency.getAssignedVolunteerId())
                .completionNotes(emergency.getCompletionNotes())
                .completedBy(emergency.getCompletedBy())
                .completedByUserId(emergency.getCompletedByUserId())
                .createdAt(emergency.getCreatedAt())
                .updatedAt(emergency.getUpdatedAt())
                .resolvedAt(emergency.getResolvedAt())
                .build();
    }
}
