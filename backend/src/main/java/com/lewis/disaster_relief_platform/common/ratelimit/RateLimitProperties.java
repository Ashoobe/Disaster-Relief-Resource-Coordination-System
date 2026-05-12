/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.common.ratelimit;


import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix="app.rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private Map<String, Rule> routes = new HashMap<>();
    public boolean isEnabled() {
        return enabled;
    }
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    public Map<String, Rule> getRoutes() {
        return routes;
    }
    public void setRoutes(Map<String, Rule> routes) {
        this.routes = routes;
    }
    public static class Rule {
        private long limit;
        private long windowSeconds;
        private KeyType keyType = KeyType.IP;
        public long getLimit() {
            return limit;
        }
        public void setLimit(long limit) {
            this.limit = limit;
        }
        public long getWindowSeconds() {
            return windowSeconds;
        }
        public void setWindowSeconds(long windowSeconds) {
            this.windowSeconds = windowSeconds;
        }
        public KeyType getKeyType() {
            return keyType;
        }
        public void setKeyType(KeyType keyType) {
            this.keyType = keyType;
        }
    }
    public enum KeyType {
        IP, JWT_USER, IP_AND_IDENTIFIER
    }

}
