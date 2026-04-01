package com.company.hrms.dto;

import jakarta.validation.constraints.*;

// DTO used for user registration with validation
public record RegisterRequest(

        @NotBlank(message = "Username is required") // Must not be null/empty
        @Size(min = 3, max = 50)                   // Username length constraints
        String username,

        @NotBlank(message = "Password is required") // Must not be null/empty
        @Size(min = 6, max = 100)                   // Password length constraints
        String password,

        @NotBlank(message = "Role is required") // Must specify a role (e.g., EMPLOYEE, ADMIN)
        String role,

        @NotNull(message = "Department ID is required") // Must provide department ID
        Long departmentId
) {}