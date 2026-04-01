package com.company.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "leave_requests") // Stores leave requests submitted by employees
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevent lazy-load serialization issues
    private Employee employee; // Employee who submitted the leave

    @Column(nullable = false)
    private LocalDate startDate; // Leave start date

    @Column(nullable = false)
    private LocalDate endDate; // Leave end date

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType type; // Type of leave (e.g., SICK, VACATION)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING; // Current status of the leave request

    // Protected no-args constructor required by JPA
    protected LeaveRequest() {}

    // Convenience constructor for creating a new leave request
    public LeaveRequest(Employee employee,
                        LocalDate startDate,
                        LocalDate endDate,
                        LeaveType type) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
    }

    // --- GETTERS ---
    public Long getId() { return id; }
    public Employee getEmployee() { return employee; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LeaveType getType() { return type; }
    public LeaveStatus getStatus() { return status; }

    // --- SETTERS ---
    public void setEmployee(Employee employee) { this.employee = employee; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setType(LeaveType type) { this.type = type; }
    public void setStatus(LeaveStatus status) { this.status = status; }
}