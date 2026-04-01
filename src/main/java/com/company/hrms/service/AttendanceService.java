package com.company.hrms.service;

import com.company.hrms.entity.Attendance;
import com.company.hrms.entity.Employee;
import com.company.hrms.repository.AttendanceRepository;
import com.company.hrms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AttendanceService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final SystemClockService clockService;

    public AttendanceService(EmployeeRepository employeeRepository,
                             AttendanceRepository attendanceRepository,
                             SystemClockService clockService) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.clockService = clockService;
    }

    public void markAttendance(String username, int hoursWorked) {

        // Retrieve employee by linked User entity
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        markAttendanceInternal(employee, hoursWorked);
    }

    private void markAttendanceInternal(Employee employee, int hoursWorked) {

        // Validate input
        if (hoursWorked <= 0) {
            throw new IllegalArgumentException("Hours worked must be greater than 0");
        }

        LocalDate today = clockService.today(); // Get current system date

        // Prevent duplicate attendance for the same day
        attendanceRepository.findByEmployee_IdAndDate(employee.getId(), today)
                .ifPresent(a -> {
                    throw new RuntimeException("Attendance already marked for today");
                });

        // Calculate overtime
        int overtime = Math.max(0, hoursWorked - employee.getStandardHoursPerDay());

        // Create and save attendance record
        Attendance attendance = new Attendance(
                employee,
                today,
                hoursWorked,
                overtime
        );

        attendanceRepository.save(attendance);
    }
}