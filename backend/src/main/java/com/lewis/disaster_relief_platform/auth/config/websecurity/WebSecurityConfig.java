/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.config.websecurity;

import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.config.filter.JwtAccessDeniedHandler;
import com.lewis.disaster_relief_platform.auth.config.filter.JwtAuthenticationEntryPoint;
import com.lewis.disaster_relief_platform.auth.config.filter.JwtAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig {
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private JwtAuthorizationFilter jwtAuthorizationFilter;
    private UserDetailsService userDetailsService;

    @Autowired
    public WebSecurityConfig(JwtAccessDeniedHandler jwtAccessDeniedHandler,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtAuthorizationFilter jwtAuthorizationFilter,
            UserDetailsService userDetailsService) {
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
        this.userDetailsService = userDetailsService;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.
        // disable csrf and enable cors
                csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())

                // set session mgmt to stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // configure request auth

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(SecurityConstant.PUBLIC_URLS).permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(exception -> exception.accessDeniedHandler(jwtAccessDeniedHandler)
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
