/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.common.ratelimit;


import com.lewis.disaster_relief_platform.common.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitService {

    private final RateLimitConfig rateLimitConfig;
    private final Map<String, Bucket> buckets;
    private final RedisTemplate<String, Object> redisTemplate;

    public boolean allowRequest(String key, RateLimitType type) {
        if (!rateLimitConfig.isEnabled()) {
            return true;
        }

        String redisKey = "rate_limit:" + type.name() + ":" + key;

        // Try to get bucket from local cache first (for performance)
        Bucket bucket = buckets.get(redisKey);

        if (bucket == null) {
            // Create new bucket based on type
            bucket = createBucket(type);
            buckets.put(redisKey, bucket);

            // Set expiration in Redis (cleanup)
            redisTemplate.opsForValue().set(redisKey, "1", getDuration(type), TimeUnit.MINUTES);
        }

        boolean allowed = bucket.tryConsume(1);

        if (!allowed) {
            log.warn("Rate limit exceeded for key: {} (type: {})", key, type);
        }

        return allowed;
    }

    private Bucket createBucket(RateLimitType type) {
        return switch (type) {
            case EMERGENCY_CREATION -> rateLimitConfig.createEmergencyCreationBucket();
            case EMERGENCY_TRACKING -> rateLimitConfig.createEmergencyTrackingBucket();
            case AUTHENTICATED -> rateLimitConfig.createAuthenticatedBucket();
        };
    }

    private long getDuration(RateLimitType type) {
        return switch (type) {
            case EMERGENCY_CREATION -> rateLimitConfig.getEmergencyCreation().getRefillDurationMinutes();
            case EMERGENCY_TRACKING -> rateLimitConfig.getEmergencyTracking().getRefillDurationMinutes();
            case AUTHENTICATED -> rateLimitConfig.getAuthenticated().getRefillDurationMinutes();
        };
    }

    public enum RateLimitType {
        EMERGENCY_CREATION,
        EMERGENCY_TRACKING,
        AUTHENTICATED
    }
}