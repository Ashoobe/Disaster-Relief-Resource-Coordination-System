/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.config.token;

import com.auth0.jwt.JWT;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.model.UserPrinciple;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Component
public class JWTUtil {
    private Algorithm algorithm; // Cache the algorithm

    @Value("${jwt.secret}")
    private String secret;

    @jakarta.annotation.PostConstruct
    protected void init() {
        this.algorithm = Algorithm.HMAC512(secret);
    }

    public String generateJwtToken(UserPrinciple user) {
        String[] claims = getClaimsFromUser(user);
        return JWT.create().withIssuer(SecurityConstant.DISASTER_RELIEF_ORG)
                .withAudience(SecurityConstant.DISASTER_RELIEF_APP)
                .withIssuedAt(new Date())
                .withSubject(user.getUsername())
                .withArrayClaim(SecurityConstant.AUTHORITIES, claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.EXPIRATION_TIME))
                 .sign(Algorithm.HMAC512(secret));

    }

    private String[] getClaimsFromUser(UserPrinciple user) {
        return user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority).toArray(String[]::new);
    }


    public List<GrantedAuthority> getAuthorities(String token) {
        String[] claims = getClaimsFromToken(token);
        return stream(claims)
                .map(claim -> new SimpleGrantedAuthority(claim.startsWith("ROLE_") ? claim : "ROLE_" + claim))
                .collect(Collectors.toList());
    }


    private String[] getClaimsFromToken(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getClaim(SecurityConstant.AUTHORITIES).asArray(String.class);
    }


    private JWTVerifier getJWTVerifier() {
        try {
            return JWT.require(algorithm) // Use the cached algorithm
                    .withIssuer(SecurityConstant.DISASTER_RELIEF_ORG)
                    .build();
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException(SecurityConstant.TOKEN_CANNOT_BE_VERIFIED);
        }
    }


    public Authentication getAuthentication(String username, List<GrantedAuthority> authorities, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken userPasswordAuthToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
        userPasswordAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return userPasswordAuthToken;
    }

    public boolean isTokenValid(String username, String token) {
        JWTVerifier verifier = getJWTVerifier();
        return StringUtils.isNotEmpty(username) && !isTokenExpired(verifier, token);
    }

    private boolean isTokenExpired(JWTVerifier verifier, String token) {
        Date expiration = verifier.verify(token).getExpiresAt();
        return expiration.before(new Date());
    }

    public String getSubject(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getSubject();
    }
}
