/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.volunteer.repository;

import com.lewis.disaster_relief_platform.volunteer.model.AvailabilityStatus;
import com.lewis.disaster_relief_platform.volunteer.model.Volunteer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer, String> {

    Optional<Volunteer> findByUserId(String userId);

    Optional<Volunteer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUserId(String userId);

    Page<Volunteer> findByAvailabilityStatus(AvailabilityStatus status, Pageable pageable);

    Page<Volunteer> findBySkillsContaining(String skill, Pageable pageable);

    Page<Volunteer> findByLocationCity(String city, Pageable pageable);

    Page<Volunteer> findByVerified(boolean verified, Pageable pageable);

    @Query("{'availabilityStatus': ?0, 'skills': {$in: ?1}}")
    Page<Volunteer> findByStatusAndSkills(
            AvailabilityStatus status,
            List<String> skills,
            Pageable pageable
    );

    // Count statistics
    long countByAvailabilityStatus(AvailabilityStatus status);

    long countByVerified(boolean verified);
}
