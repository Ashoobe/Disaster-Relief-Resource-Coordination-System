/*
 * Copyright (c) 2026 Prithu Kathet
 * GitHub: https://github.com/prithuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

package com.lewis.disaster_relief_platform.auth.config.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.dto.response.HttpResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {


    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        HttpResponse httpResponse=new HttpResponse(new Date(), HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED.getReasonPhrase().toUpperCase(), SecurityConstant.ACCESS_DENIED_MESSAGE);
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        OutputStream outputStream=response.getOutputStream();
        ObjectMapper objectMapper=new ObjectMapper();
        objectMapper.writeValue(outputStream,httpResponse);
        outputStream.flush();
    }
}
