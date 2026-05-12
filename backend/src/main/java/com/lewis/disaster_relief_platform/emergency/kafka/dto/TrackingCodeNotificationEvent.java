/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.kafka.dto;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
public record TrackingCodeNotificationEvent(String type, String toEmail, String trackingCode, String emergencyTitle,
                                            String emergencyId) {
    public static final String TYPE_TRACKING_CODE_EMAIL = "TRACKING_CODE_EMAIL";

    public static TrackingCodeNotificationEvent of(String toEmail, String trackingCode, String emergencyTitle, String emergencyId) {
        return new TrackingCodeNotificationEvent(TYPE_TRACKING_CODE_EMAIL, toEmail, trackingCode, emergencyTitle, emergencyId);
    }
}
