/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackingEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    public void sendTrackingCode(String toEmail, String trackingCode, String emergencyTitle){

        if(!StringUtils.hasText(toEmail)){
            log.warn("Skipping tracking email: recipient address is empty");
            return;
        }

        if (!StringUtils.hasText(fromAddress)) {
            log.warn("Skipping tracking email: app.mail.from / spring.mail.username is not configured");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Disaster Relief — Your emergency tracking code");
        message.setText(buildBody(trackingCode, emergencyTitle));
        try {
            mailSender.send(message);
            log.info("Tracking code email sent to {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send tracking code email to {}", toEmail, e);
        }
    }

    private String buildBody(String trackingCode, String emergencyTitle) {
        String titleLine = StringUtils.hasText(emergencyTitle)
                ? "Request: " + emergencyTitle + "\n\n"
                : "";
        return titleLine
                + "Thank you for reporting an emergency. Use this tracking code to check status:\n\n"
                + "    " + trackingCode + "\n\n"
                + "Keep this code safe. You can use it on the public track page without logging in.";
    }
    }

