package com.company.hrms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO for user login; contains credentials with validation
public record LoginRequest(

        @NotBlank(message = "Username is required") // Must not be null or empty
        @Size(min = 3, max = 50) // Username length constraints
        String username,

        @NotBlank(message = "Password is required") // Must not be null or empty
        @Size(min = 6, max = 100) // Password length constraints
        String password
) {}