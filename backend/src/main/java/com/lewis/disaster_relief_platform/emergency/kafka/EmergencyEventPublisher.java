/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.kafka;


import com.lewis.disaster_relief_platform.common.config.KafkaConfig;
import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmergencyEventPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    
    @Value("${app.kafka.enabled:false}")
    private boolean kafkaEnabled;
    
    public void publishEmergencyCreated(Emergency emergency) {
        String emergencyCreated = buildEventMessage("EMERGENCY_CREATED", emergency);
        send(emergency.getId(), emergencyCreated);
    }
    public void publishStatusUpdated(Emergency emergency) {
        String message = buildEventMessage("EMERGENCY_STATUS_UPDATED", emergency);
        send(emergency.getId(), message);
    }

    public void publishVolunteerAssigned(Emergency emergency, String volunteerId) {
        String message = String.format(
                "{\"eventType\":\"VOLUNTEER_ASSIGNED\",\"emergencyId\":\"%s\",\"volunteerId\":\"%s\",\"timestamp\":\"%s\"}",
                emergency.getId(),
                volunteerId,
                LocalDateTime.now()
        );
        send(emergency.getId(), message);
    }

    private String buildEventMessage(String eventType, Emergency emergency) {
        return String.format("{\"eventType\":\"%s\",\"emergencyId\":\"%s\",\"type\":\"%s\",\"priority\":\"%s\",\"status\":\"%s\",\"timestamp\":\"%s\"}", eventType, emergency.getId(), emergency.getType(), emergency.getPriority(), emergency.getStatus(), LocalDateTime.now());
    }


    private void send(String key, String message) {
        if (!kafkaEnabled) {
            log.debug("Kafka publishing is disabled; skipping event {}", message);
            return;
        }
        CompletableFuture.runAsync(() -> {
            try {
                kafkaTemplate.send(KafkaConfig.EMERGENCY_TOPIC, key, message);
                log.info("Published event to Kafka: {}", message);
            } catch (Exception exception) {
                log.error("Failed to publish event to Kafka", exception);
            }
        });
    }
}
