/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.common.config;


import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@ConfigurationProperties(prefix = "rate-limit")
@Data
public class RateLimitConfig {

    private boolean enabled = true;
    private EmergencyCreationLimit emergencyCreation = new EmergencyCreationLimit();
    private EmergencyTrackingLimit emergencyTracking = new EmergencyTrackingLimit();
    private AuthenticatedLimit authenticated = new AuthenticatedLimit();

    @Data
    public static class EmergencyCreationLimit {
        private long capacity = 5;
        private long refillTokens = 5;
        private long refillDurationMinutes = 1;
    }

    @Data
    public static class EmergencyTrackingLimit {
        private long capacity = 20;
        private long refillTokens = 20;
        private long refillDurationMinutes = 1;
    }

    @Data
    public static class AuthenticatedLimit {
        private long capacity = 100;
        private long refillTokens = 100;
        private long refillDurationMinutes = 1;
    }

    @Bean
    public Map<String, Bucket> buckets() {
        return new ConcurrentHashMap<>();
    }

    public Bucket createEmergencyCreationBucket() {
        Bandwidth limit = Bandwidth.classic(
                emergencyCreation.getCapacity(),
                Refill.intervally(
                        emergencyCreation.getRefillTokens(),
                        Duration.ofMinutes(emergencyCreation.getRefillDurationMinutes())
                )
        );
        return Bucket.builder().addLimit(limit).build();
    }

    public Bucket createEmergencyTrackingBucket() {
        Bandwidth limit = Bandwidth.classic(
                emergencyTracking.getCapacity(),
                Refill.intervally(
                        emergencyTracking.getRefillTokens(),
                        Duration.ofMinutes(emergencyTracking.getRefillDurationMinutes())
                )
        );
        return Bucket.builder().addLimit(limit).build();
    }

    public Bucket createAuthenticatedBucket() {
        Bandwidth limit = Bandwidth.classic(
                authenticated.getCapacity(),
                Refill.intervally(
                        authenticated.getRefillTokens(),
                        Duration.ofMinutes(authenticated.getRefillDurationMinutes())
                )
        );
        return Bucket.builder().addLimit(limit).build();
    }
}
