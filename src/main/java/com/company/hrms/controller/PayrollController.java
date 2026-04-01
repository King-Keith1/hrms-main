package com.company.hrms.controller;

import com.company.hrms.dto.PayslipResponse;
import com.company.hrms.entity.Payroll;
import com.company.hrms.repository.PayrollRepository;
import com.company.hrms.service.PayrollService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/payroll") // REST endpoints for payroll management
public class PayrollController {

    private final PayrollService payrollService;
    private final PayrollRepository payrollRepository;

    // Constructor injection for payroll service and repository
    public PayrollController(PayrollService payrollService,
                             PayrollRepository payrollRepository) {
        this.payrollService = payrollService;
        this.payrollRepository = payrollRepository;
    }

    // Generates payroll and a payslip for a specific employee and month
    @PostMapping("/generate/{employeeId}")
    @PreAuthorize("hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_ADMIN')")
    public PayslipResponse generate(
            @PathVariable Long employeeId,
            @RequestParam YearMonth month) {
        return payrollService.generatePayroll(employeeId, month);
    }

    // Retrieves all payroll records in the system
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<Payroll> getAllPayroll() {
        return payrollRepository.findAll();
    }

    // Retrieves payroll history for a specific employee
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<Payroll> getPayrollByEmployee(@PathVariable Long employeeId) {
        return payrollRepository.findByEmployee_Id(employeeId);
    }
}