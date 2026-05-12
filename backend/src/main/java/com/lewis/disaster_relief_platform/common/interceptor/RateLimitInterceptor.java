/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.common.interceptor;


import com.lewis.disaster_relief_platform.common.exception.domain.RateLimitExceededException;
import com.lewis.disaster_relief_platform.common.ratelimit.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Determine rate limit type based on endpoint
        RateLimitService.RateLimitType limitType;
        String key;

        if (uri.contains("/emergencies") && "POST".equals(method)) {
            // Emergency creation
            limitType = RateLimitService.RateLimitType.EMERGENCY_CREATION;
            key = getClientIP(request);

        } else if (uri.contains("/track/")) {
            // Emergency tracking
            limitType = RateLimitService.RateLimitType.EMERGENCY_TRACKING;
            key = getClientIP(request);

        } else if (isAuthenticated()) {
            // Authenticated requests
            limitType = RateLimitService.RateLimitType.AUTHENTICATED;
            key = getCurrentUsername();

        } else {
            // No rate limit for other public endpoints
            return true;
        }

        boolean allowed = rateLimitService.allowRequest(key, limitType);

        if (!allowed) {
            throw new RateLimitExceededException(
                    "Rate limit exceeded. Please try again later."
            );
        }

        return true;
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    private boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal());
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "anonymous";
    }
}