/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppNotificationRequest {
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
}
