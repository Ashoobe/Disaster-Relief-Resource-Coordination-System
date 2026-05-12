/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.dto.response;

import com.lewis.disaster_relief_platform.volunteer.model.AvailabilityStatus;
import com.lewis.disaster_relief_platform.volunteer.model.Location;
import com.lewis.disaster_relief_platform.volunteer.model.Volunteer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerResponse {

    private String id;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private List<String> skills;
    private AvailabilityStatus availabilityStatus;
    private Location location;
    private boolean verified;
    private Integer completedAssignments;
    private Integer activeAssignments;
    private Double rating;
    private List<String> preferredEmergencyTypes;
    private Integer maxTravelDistanceKm;
    private LocalDateTime registeredAt;
    private LocalDateTime lastActiveAt;

    public static VolunteerResponse fromEntity(Volunteer volunteer) {
        return VolunteerResponse.builder()
                .id(volunteer.getId())
                .userId(volunteer.getUserId())
                .name(volunteer.getName())
                .email(volunteer.getEmail())
                .phone(volunteer.getPhone())
                .skills(volunteer.getSkills())
                .availabilityStatus(volunteer.getAvailabilityStatus())
                .location(volunteer.getLocation())
                .verified(volunteer.isVerified())
                .completedAssignments(volunteer.getCompletedAssignments())
                .activeAssignments(volunteer.getActiveAssignments())
                .rating(volunteer.getRating())
                .preferredEmergencyTypes(volunteer.getPreferredEmergencyTypes())
                .maxTravelDistanceKm(volunteer.getMaxTravelDistanceKm())
                .registeredAt(volunteer.getRegisteredAt())
                .lastActiveAt(volunteer.getLastActiveAt())
                .build();
    }
}
