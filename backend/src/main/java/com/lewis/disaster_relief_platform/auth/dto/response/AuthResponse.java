/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.dto.response;

import com.lewis.disaster_relief_platform.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private String userId;
    private String username;
    private String fullName;
    private String email;
    private Set<Role> role;
    private long expiresIn; // milliseconds
}
