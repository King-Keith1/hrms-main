package com.company.hrms.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

// DTO for creating a new employee; includes validation annotations
public record CreateEmployeeRequest(

        @NotBlank(message = "Full name is required") // Must not be null/empty
        @Size(max = 100) // Max length 100 characters
        String fullName,

        @NotBlank(message = "Employee number is required") // Must not be null/empty
        @Size(max = 20) // Max length 20 characters
        String employeeNumber,

        @NotNull(message = "Department ID is required") // Must be provided
        Long departmentId,

        @NotNull(message = "Hourly rate is required") // Must be provided
        @DecimalMin(value = "0.0", inclusive = false) // Must be > 0
        BigDecimal hourlyRate,

        String username // Optional username for linking with a user account
) {}