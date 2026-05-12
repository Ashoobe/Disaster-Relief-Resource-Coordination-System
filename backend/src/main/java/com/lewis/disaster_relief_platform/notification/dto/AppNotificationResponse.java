/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification.dto;

import com.lewis.disaster_relief_platform.notification.model.AppNotification;
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
public class AppNotificationResponse {
    private String id;
    private String title;
    private String body;
    private String type;
    private String requestId;
    private String trackingCode;
    private String actionPath;
    private String audience;
    private List<String> roleAudience;
    private List<String> recipientUserIds;
    private List<String> recipientEmails;
    private List<String> readBy;
    private boolean read;
    private LocalDateTime createdAt;

    public static AppNotificationResponse fromEntity(AppNotification notification, boolean read) {
        return AppNotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .body(notification.getBody())
                .type(notification.getType())
                .requestId(notification.getRequestId())
                .trackingCode(notification.getTrackingCode())
                .actionPath(notification.getActionPath())
                .audience(notification.getAudience())
                .roleAudience(notification.getRoleAudience())
                .recipientUserIds(notification.getRecipientUserIds())
                .recipientEmails(notification.getRecipientEmails())
                .readBy(notification.getReadBy())
                .read(read)
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
