package com.company.hrms.dto;

import java.math.BigDecimal;
import java.time.YearMonth;

// DTO representing the payslip for an employee for a given month
public record PayslipResponse(
        String employeeName, // Employee full name
        YearMonth month,     // Payroll month
        BigDecimal grossPay  // Total gross pay for the month
) {}