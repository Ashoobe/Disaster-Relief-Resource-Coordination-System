/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.kafka;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lewis.disaster_relief_platform.common.config.KafkaConfig;
import com.lewis.disaster_relief_platform.emergency.kafka.dto.TrackingCodeNotificationEvent;
import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmergencyEventPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
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
        try {
            kafkaTemplate.send(KafkaConfig.EMERGENCY_TOPIC, key, message);
            log.info("Published event to Kafka: {}", message);
        } catch (Exception exception) {
            log.error("Failed to publish event to Kafka", exception);
        }

    }


    public void publishTrackingCodeEmail(Emergency emergency) {
        if (emergency.getContactEmail() == null || emergency.getContactEmail().isBlank()) {
            log.debug("No contact email; skipping tracking notification topic");
            return;
        }
        TrackingCodeNotificationEvent event = TrackingCodeNotificationEvent.of(
                emergency.getContactEmail().trim(),
                emergency.getTrackingCode(),
                emergency.getTitle(),
                emergency.getId()
        );
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaConfig.NOTIFICATION_TOPIC, emergency.getId(), json);
            log.info("Published tracking notification to Kafka topic {}", KafkaConfig.NOTIFICATION_TOPIC);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize tracking notification", e);
        }
    }
}
