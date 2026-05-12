/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification.controller;

import com.lewis.disaster_relief_platform.common.dto.ApiResponse;
import com.lewis.disaster_relief_platform.notification.dto.AppNotificationRequest;
import com.lewis.disaster_relief_platform.notification.dto.AppNotificationResponse;
import com.lewis.disaster_relief_platform.notification.service.AppNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class AppNotificationController {
    private final AppNotificationService notificationService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AppNotificationResponse>>> getMyNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getCurrentUserNotifications()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AppNotificationResponse>> createNotification(@Valid @RequestBody AppNotificationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.create(request), "Notification saved"));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AppNotificationResponse>> markRead(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markRead(id), "Notification marked read"));
    }

    @PatchMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AppNotificationResponse>>> markAllRead() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markAllRead(), "Notifications marked read"));
    }
}
