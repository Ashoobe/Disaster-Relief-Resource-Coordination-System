/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.config.integration;

import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.config.token.JWTUtil;
import com.lewis.disaster_relief_platform.auth.model.UserPrinciple;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import static com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant.JWT_TOKEN_HEADER;

@Component
@RequiredArgsConstructor
public class IntegrationService {

    private final AuthenticationManager authenticationManager;

    public void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    public HttpHeaders createJWTHeader(String token) {
        HttpHeaders headers=new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX + token);
        return headers;
    }

}
