/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.model;


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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "volunteers")
public class Volunteer {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;  // Link to User account (from auth module)

    private String name;

    @Indexed
    private String email;

    private String phone;

    private List<String> skills;  // ["First Aid", "Food Distribution", "Medical", "Rescue"]

    @Indexed
    private AvailabilityStatus availabilityStatus;

    private Location location;

    // Verification
    private boolean verified;
    private String verificationDocumentUrl;  // Optional: ID proof

    // Statistics
    private Integer completedAssignments;
    private Integer activeAssignments;
    private Double rating;  // 0-5 stars

    // Emergency preferences
    private List<String> preferredEmergencyTypes;  // ["FOOD", "MEDICAL"]
    private Integer maxTravelDistanceKm;

    @CreatedDate
    private LocalDateTime registeredAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastActiveAt;




}
