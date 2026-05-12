/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class AppNotification {
    @Id
    private String id;

    private String title;
    private String body;
    private String type;

    @Indexed
    private String requestId;

    @Indexed
    private String trackingCode;

    private String actionPath;
    private String audience;
    private List<String> roleAudience;
    private List<String> recipientUserIds;
    private List<String> recipientEmails;
    private List<String> readBy;

    @Indexed
    private LocalDateTime createdAt;
}
