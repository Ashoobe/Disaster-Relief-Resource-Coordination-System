/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.common.config;


import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    public static final String EMERGENCY_TOPIC = "emergency-requests";
    public static final String RESOURCE_TOPIC = "resource-allocations";
    public static final String NOTIFICATION_TOPIC = "notifications";


    @Bean
    public NewTopic emergencyTopic(){
        return TopicBuilder.name(EMERGENCY_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic resourceTopic() {
        return TopicBuilder
                .name(RESOURCE_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic notificationTopic() {
        return TopicBuilder
                .name(NOTIFICATION_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

}
