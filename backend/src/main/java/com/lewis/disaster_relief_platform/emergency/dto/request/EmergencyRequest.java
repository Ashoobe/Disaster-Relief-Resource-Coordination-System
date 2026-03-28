/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.emergency.dto.request;

import com.lewis.disaster_relief_platform.emergency.model.EmergencyType;
import com.lewis.disaster_relief_platform.emergency.model.Priority;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class EmergencyRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    @NotNull(message = "Emergency type is required")
    private EmergencyType type;

    @NotBlank(message = "Disaster type is required")
    private String disasterType;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Location is required")
    private LocationRequest location;

    @NotBlank(message = "Reporter name is required")
    @Size(min = 2, max = 100, message = "Reporter name must be between 2 and 100 characters")
    private String reportedBy;

    @Pattern(regexp = "^[0-9]{7,15}$", message = "Contact phone must be 7-15 digits")
    private String contactPhone;

    @Email(message = "Invalid email format")
    private String contactEmail;

    @Min(value = 1, message = "Affected people must be at least 1")
    @Max(value = 100000, message = "Affected people cannot exceed 100,000")
    private Integer affectedPeople;

    private List<String> requiredResources;

}
