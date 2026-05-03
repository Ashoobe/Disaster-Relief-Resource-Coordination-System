/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.notification;

import com.lewis.disaster_relief_platform.emergency.model.Emergency;
import com.lewis.disaster_relief_platform.emergency.model.Location;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAlertEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    @Value("${app.mail.request-alert-to:}")
    private String requestAlertRecipients;

    public void sendNewRequestAlert(Emergency emergency) {
        String[] recipients = parseRecipients();
        if (recipients.length == 0) {
            log.debug("Skipping new request alert email: app.mail.request-alert-to is not configured");
            return;
        }

        if (!StringUtils.hasText(fromAddress)) {
            log.warn("Skipping new request alert email: app.mail.from / spring.mail.username is not configured");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(recipients);
        message.setSubject("DRRCS new emergency request: " + safe(emergency.getTrackingCode()));
        message.setText(buildBody(emergency));

        try {
            mailSender.send(message);
            log.info("New request alert email sent for emergency {}", emergency.getId());
        } catch (MailException e) {
            log.error("Failed to send new request alert email for emergency {}", emergency.getId(), e);
        }
    }

    private String[] parseRecipients() {
        if (!StringUtils.hasText(requestAlertRecipients)) {
            return new String[0];
        }
        return Arrays.stream(requestAlertRecipients.split("[,;]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toArray(String[]::new);
    }

    private String buildBody(Emergency emergency) {
        return "A new emergency request was submitted.\n\n"
                + "Tracking ID: " + safe(emergency.getTrackingCode()) + "\n"
                + "Title: " + safe(emergency.getTitle()) + "\n"
                + "Type: " + safe(emergency.getType()) + "\n"
                + "Disaster type: " + safe(emergency.getDisasterType()) + "\n"
                + "Priority: " + safe(emergency.getPriority()) + "\n"
                + "Status: " + safe(emergency.getStatus()) + "\n"
                + "Reported by: " + safe(emergency.getReportedBy()) + "\n"
                + "Contact email: " + safe(emergency.getContactEmail()) + "\n"
                + "Contact phone: " + safe(emergency.getContactPhone()) + "\n"
                + "Affected people: " + safe(emergency.getAffectedPeople()) + "\n"
                + "Required resources: " + formatResources(emergency.getRequiredResources()) + "\n"
                + "Location: " + formatLocation(emergency.getLocation()) + "\n\n"
                + "Description:\n" + safe(emergency.getDescription());
    }

    private String formatResources(List<String> resources) {
        if (resources == null || resources.isEmpty()) {
            return "Not provided";
        }
        return String.join(", ", resources);
    }

    private String formatLocation(Location location) {
        if (location == null) {
            return "Not provided";
        }
        return String.join(", ", Arrays.asList(
                safe(location.getAddress()),
                safe(location.getCity()),
                safe(location.getState()),
                safe(location.getZipCode()),
                safe(location.getCountry())
        )).replaceAll("(, Not provided)+$", "");
    }

    private String safe(Object value) {
        return value == null || !StringUtils.hasText(String.valueOf(value))
                ? "Not provided"
                : String.valueOf(value);
    }
}
