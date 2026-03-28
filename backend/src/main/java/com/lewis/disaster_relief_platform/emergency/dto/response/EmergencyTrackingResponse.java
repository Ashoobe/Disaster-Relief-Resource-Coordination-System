/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.dto.response;


import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import com.lewis.disaster_relief_platform.emergency.model.Priority;
import com.lewis.disaster_relief_platform.emergency.model.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyTrackingResponse {
    private String trackingCode;
    private String title;
    private Status status;
    private Priority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String statusMessage;  // User-friendly status description

    public static EmergencyTrackingResponse fromEntity(Emergency emergency) {
        return EmergencyTrackingResponse.builder()
                .trackingCode(emergency.getTrackingCode())
                .title(emergency.getTitle())
                .status(emergency.getStatus())
                .priority(emergency.getPriority())
                .createdAt(emergency.getCreatedAt())
                .updatedAt(emergency.getUpdatedAt())
                .statusMessage(getStatusMessage(emergency.getStatus()))
                .build();
    }

    private static String getStatusMessage(Status status) {
        return switch (status) {
            case PENDING_VERIFICATION -> "Your emergency request is being reviewed by our team.";
            case PENDING -> "Your request has been verified and is awaiting assignment.";
            case ASSIGNED -> "A volunteer has been assigned to your emergency.";
            case IN_PROGRESS -> "Help is on the way! Your emergency is being addressed.";
            case RESOLVED -> "Your emergency has been resolved. Thank you for your patience.";
            case CANCELLED -> "This emergency request has been cancelled.";
        };
    }
}
