package com.company.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "employees") // Stores employee information
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @Column(nullable = false)
    private String fullName; // Employee full name

    @Column(unique = true, nullable = false)
    private String employeeNumber; // Unique employee identifier

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevent lazy-load serialization issues
    private Department department; // Employee's department

    @Column(nullable = false)
    private BigDecimal hourlyRate; // Hourly pay rate

    @Column(nullable = false)
    private int standardHoursPerDay = 8; // Default standard workday hours

    @Column(nullable = false)
    private boolean active = true; // Indicates if the employee is currently active

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "authorities", "accountNonExpired",
            "accountNonLocked", "credentialsNonExpired",
            "enabled", "hibernateLazyInitializer", "handler",
            "department"}) // Prevent sensitive info and lazy-load issues from being serialized
    private User user; // Linked user account (optional)

    // Protected no-args constructor required by JPA
    protected Employee() {}

    // Convenience constructor for creating new employee
    public Employee(String fullName,
                    String employeeNumber,
                    Department department,
                    BigDecimal hourlyRate) {
        this.fullName = fullName;
        this.employeeNumber = employeeNumber;
        this.department = department;
        this.hourlyRate = hourlyRate;
    }

    // --- GETTERS ---
    public Long getId() {
        return id;
    }
    public String getFullName() {
        return fullName;
    }
    public String getEmployeeNumber() {
        return employeeNumber;
    }
    public Department getDepartment() {
        return department;
    }
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    public int getStandardHoursPerDay() {
        return standardHoursPerDay;
    }
    public boolean isActive() {
        return active;
    }
    public User getUser() {
        return user;
    }

    // --- SETTERS ---
    public void setId(Long id) {
        this.id = id;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    public void setStandardHoursPerDay(int standardHoursPerDay) {
        this.standardHoursPerDay = standardHoursPerDay;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    public void setUser(User user) {
        this.user = user;
    }
}