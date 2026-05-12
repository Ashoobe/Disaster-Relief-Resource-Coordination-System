/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.model;


public enum AvailabilityStatus {
    AVAILABLE,        // Ready to take assignments
    BUSY,            // Temporarily unavailable
    ON_ASSIGNMENT,   // Currently assigned to emergency
    UNAVAILABLE      // Not available (vacation, etc.)
}
