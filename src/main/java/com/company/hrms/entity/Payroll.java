package com.company.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.YearMonth;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "payroll") // Stores payroll records for employees
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @Column(nullable = false)
    private BigDecimal grossPay; // Total gross pay for the payroll period

    @Column(name = "payroll_month", nullable = false)
    private String payrollMonth; // Month of payroll in YYYY-MM format (stored as String)

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"}) // Prevent lazy-load serialization and user recursion
    private Employee employee; // Employee for whom the payroll is generated

    // Protected no-args constructor required by JPA
    protected Payroll() {}

    // Convenience constructor
    public Payroll(Employee employee, String payrollMonth, BigDecimal grossPay) {
        this.employee = employee;
        this.payrollMonth = payrollMonth;
        this.grossPay = grossPay;
    }

    // --- GETTERS ---
    public Long getId() {
        return id;
    }
    public BigDecimal getGrossPay() {
        return grossPay;
    }
    public String getPayrollMonth() {
        return payrollMonth;
    }
    public Employee getEmployee() {
        return employee;
    }

    // --- SETTERS ---
    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    public void setPayrollMonth(String payrollMonth) {
        this.payrollMonth = payrollMonth;
    }
    public void setGrossPay(BigDecimal grossPay) {
        this.grossPay = grossPay;
    }
}