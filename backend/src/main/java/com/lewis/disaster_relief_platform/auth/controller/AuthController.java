/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.controller;


import com.lewis.disaster_relief_platform.auth.config.integration.IntegrationService;
import com.lewis.disaster_relief_platform.auth.dto.request.LoginRequest;
import com.lewis.disaster_relief_platform.auth.dto.request.RegisterRequest;
import com.lewis.disaster_relief_platform.auth.dto.response.AuthResponse;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.auth.service.AuthService;
import com.lewis.disaster_relief_platform.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final IntegrationService integrationService;

    /**
     * Register a new user
     * POST /api/v1/auth/register
     */
    @PostMapping("/register")
    @Operation(summary = "Create a new User", description = "Submits a new User request and saves it to the database.")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration request for username: {}", registerRequest.getUsername());
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User Registered Successfully"));
    }

    /**
     * Login
     * POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for username: {}", request.getUsername());
        log.info("Login request for username: {}", request.getPassword());
        // 1. Authenticate (Checks password using AuthenticationManager)
        integrationService.authenticate(request.getUsername(), request.getPassword());
        // 2. Get the Response Data from Service
        AuthResponse response = authService.login(request.getUsername());
        return ResponseEntity.ok()
                .headers(integrationService.createJWTHeader(response.getToken()))
                .body(ApiResponse.success(response, "Login successful"));
    }
}
