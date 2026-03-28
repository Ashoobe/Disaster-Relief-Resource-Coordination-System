package com.lewis.disaster_relief_platform.config;

import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void seedAdminUser() {
        if (userRepository.existsByRoleContains(Role.ADMIN)) {
            log.info("Admin user already exists — skipping seed.");
            return;
        }

        String adminUsername = "admin";
        String adminPassword = "Password@123";

        if (userRepository.existsByUsername(adminUsername)) {
            // Promote existing 'admin' username to ADMIN role
            userRepository.findByUsername(adminUsername).ifPresent(u -> {
                u.setRole(Set.of(Role.ADMIN));
                u.setUpdatedAt(LocalDateTime.now());
                userRepository.save(u);
                log.info("Existing user '{}' promoted to ADMIN.", adminUsername);
            });
            return;
        }

        User admin = User.builder()
                .fullName("System Admin")
                .username(adminUsername)
                .email("admin@drrcs.org")
                .password(passwordEncoder.encode(adminPassword))
                .role(Set.of(Role.ADMIN))
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        log.info("========================================");
        log.info("Default admin user created.");
        log.info("  Username : {}", adminUsername);
        log.info("  Password : {}", adminPassword);
        log.info("  CHANGE THIS PASSWORD after first login!");
        log.info("========================================");
    }
}
