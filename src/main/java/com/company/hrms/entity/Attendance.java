package com.company.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(
        name = "attendance",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"employee_id", "date"}) // Prevent duplicate attendance entries per employee per day
        }
)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevent lazy-loading serialization issues
    private Employee employee; // Associated employee

    @Column(nullable = false)
    private LocalDate date; // Date of attendance

    @Column(nullable = false)
    private int hoursWorked; // Hours worked in the day

    private int overtimeHours; // Overtime hours (optional)

    // Protected no-args constructor required by JPA
    protected Attendance() {}

    // Convenience constructor
    public Attendance(Employee employee, LocalDate date, int hoursWorked, int overtimeHours) {
        this.employee = employee;
        this.date = date;
        this.hoursWorked = hoursWorked;
        this.overtimeHours = overtimeHours;
    }

    // --- GETTERS ---
    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getHoursWorked() {
        return hoursWorked;
    }

    public int getOvertimeHours() {
        return overtimeHours;
    }

    // --- SETTERS ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setHoursWorked(int hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    public void setOvertimeHours(int overtimeHours) {
        this.overtimeHours = overtimeHours;
    }
}