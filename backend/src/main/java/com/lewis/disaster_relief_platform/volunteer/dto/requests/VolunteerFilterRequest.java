/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.dto.requests;

import com.lewis.disaster_relief_platform.volunteer.model.AvailabilityStatus;
import lombok.Data;

@Data
public class VolunteerFilterRequest {

    private String skill;  // Search by specific skill
    private AvailabilityStatus availabilityStatus;
    private String city;
    private Boolean verifiedOnly;
    private Double latitude;   // For nearby search
    private Double longitude;
    private Integer radiusKm;  // Search within radius
}
