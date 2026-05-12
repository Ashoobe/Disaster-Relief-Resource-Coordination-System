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

import java.util.List;

@Data
public class UpdateVolunteerRequest {

    private String name;
    private String phone;
    private List<String> skills;
    private AvailabilityStatus availabilityStatus;
    private LocationRequest location;
    private List<String> preferredEmergencyTypes;
    private Integer maxTravelDistanceKm;
}
