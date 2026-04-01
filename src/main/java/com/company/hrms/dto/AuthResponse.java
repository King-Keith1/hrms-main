package com.company.hrms.dto;

// Response DTO returned after successful authentication containing the JWT token
public record AuthResponse(
        String token, // JWT access token
        String type   // Token type ("Bearer")
) {}