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
    private String disasterType;
    private Priority priority;
    private Status status;
    private Location location;
    private String reportedBy;
    private String contactPhone;
    private String contactEmail;
    private Integer affectedPeople;
    private String createdByUserId;
    private String assignedVolunteerId;
    private String assigneeName;
    private String notes;
    private LocalDateTime completedAt;
    private String completedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Factory Method to convert from Emergency entity
    public static EmergencyResponse fromEntity(Emergency emergency) {
        return EmergencyResponse.builder().id(emergency.getId()).trackingCode(emergency.getTrackingCode())
                .title(emergency.getTitle())
                .description(emergency.getDescription())
                .type(emergency.getType())
                .disasterType(emergency.getDisasterType())
                .priority(emergency.getPriority())
                .status(emergency.getStatus())
                .location(emergency.getLocation())
                .reportedBy(emergency.getReportedBy())
                .contactPhone(emergency.getContactPhone())
                .contactEmail(emergency.getContactEmail())
                .affectedPeople(emergency.getAffectedPeople())
                .createdByUserId(emergency.getCreatedByUserId())
                .assignedVolunteerId(emergency.getAssignedVolunteerId())
                .assigneeName(emergency.getAssigneeName())
                .notes(emergency.getNotes())
                .completedAt(emergency.getCompletedAt())
                .completedBy(emergency.getCompletedBy())
                .createdAt(emergency.getCreatedAt())
                .updatedAt(emergency.getUpdatedAt())
                .build();
    }
}
