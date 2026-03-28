/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.service;

import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.config.token.JWTUtil;
import com.lewis.disaster_relief_platform.auth.dto.request.RegisterRequest;
import com.lewis.disaster_relief_platform.auth.dto.response.AuthResponse;
import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.model.UserPrinciple;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.common.exception.domain.EmailAlreadyExistsException;
import com.lewis.disaster_relief_platform.common.exception.domain.InvalidCredentialsException;
import com.lewis.disaster_relief_platform.common.exception.domain.UserAlreadyExistsException;
import com.lewis.disaster_relief_platform.emergency.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final EmergencyService emergencyService; // ← NEW DEPENDENCY

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Registering new user");

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + registerRequest.getUsername());
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists:" + registerRequest.getEmail());
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Set.of(Role.VOLUNTEER))
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // ============= AUTO-LINK EMERGENCIES =============
        emergencyService.linkEmergenciesToUser(savedUser.getId(), savedUser.getEmail());

        UserPrinciple userPrinciple = new UserPrinciple(savedUser);
        // generate jwt token
        String token = jwtUtil.generateJwtToken(userPrinciple);

        return AuthResponse.builder()
                .token(token)
                .type(SecurityConstant.TOKEN_PREFIX)
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .expiresIn(SecurityConstant.EXPIRATION_TIME)
                .build();
    }

    @Transactional
    public AuthResponse login(String username) {
        log.info("Preparing login response for user: {}", username);

        // 1. Fetch user from DB — try username first, then email
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));
        log.info("USER FETCHED+" + user.getPassword());

        // 2. Update last login time (Beast Mode Auditing)
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // 3. Prepare UserPrinciple for Token Generation
        UserPrinciple userPrinciple = new UserPrinciple(user);
        String token = jwtUtil.generateJwtToken(userPrinciple);

        // 4. Build the Response Body
        return AuthResponse.builder()
                .token(token)
                .type(SecurityConstant.TOKEN_PREFIX)
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(SecurityConstant.EXPIRATION_TIME)
                .build();
    }
}
