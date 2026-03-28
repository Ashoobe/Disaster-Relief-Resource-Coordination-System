/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.config.constant;

public class SecurityConstant {

    public static final long EXPIRATION_TIME = 432_000_000;
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Authorization";
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    public static final String DISASTER_RELIEF_ORG = "PRITHU KATHET";
    public static final String DISASTER_RELIEF_APP = "DISASTER RECOVERY";
    public static final String AUTHORITIES = "authorities";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";

    public static final String[] PUBLIC_URLS = {
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/v3/api-docs/swagger-config",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/api/v1/auth/**",
            "/api/v1/emergencies/public/**"
    };
}

