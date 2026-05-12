/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.kafka;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.lewis.disaster_relief_platform.common.config.KafkaConfig;
import com.lewis.disaster_relief_platform.emergency.kafka.dto.TrackingCodeNotificationEvent;
import com.lewis.disaster_relief_platform.notification.TrackingEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmergencyEventConsumer {

    private final ObjectMapper objectMapper;
    private final TrackingEmailService trackingEmailService;

    /**
     * Consumes notification messages and sends tracking-code emails.
     * Same app: producer publishes after DB save; consumer runs async in another thread.
     */
    @KafkaListener(
            topics = KafkaConfig.NOTIFICATION_TOPIC,
            groupId = "${spring.kafka.consumer.group-id}-notifications",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onNotification(String message) {
        try {
            TrackingCodeNotificationEvent event = objectMapper.readValue(message, TrackingCodeNotificationEvent.class);
            if (!TrackingCodeNotificationEvent.TYPE_TRACKING_CODE_EMAIL.equals(event.type())) {
                log.debug("Ignoring notification type: {}", event.type());
                return;
            }
            trackingEmailService.sendTrackingCode(event.toEmail(), event.trackingCode(), event.emergencyTitle());
        } catch (Exception e) {
            log.error("Failed to process notification message: {}", message, e);
        }
    }
}