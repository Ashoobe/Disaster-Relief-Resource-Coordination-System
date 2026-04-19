/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "emergencies")
public class Emergency {
    @Id
    private String id;

    @Indexed(unique = true)
    private String trackingCode;

    @Indexed
    private String title;

    private String description;

    @Indexed
    private EmergencyType type;

    private String disasterType;

    @Indexed
    private Priority priority;

    @Indexed
    private Status status;

    private Location location;

    private String reportedBy;

    @Indexed
    private String reportedByEmail;

    private String contactPhone;

    private String contactEmail;

    private Integer affectedPeople;

    private List<String> requiredResources;

    @Indexed
    private String createdByUserId;

    private String assignedVolunteerId;

    private String assigneeName;

    private String notes;

    private LocalDateTime completedAt;

    private String completedBy;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;
}
