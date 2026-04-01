package com.company.hrms.controller;

import com.company.hrms.entity.Attendance;
import com.company.hrms.repository.AttendanceRepository;
import com.company.hrms.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AttendanceRepository attendanceRepository;

    // Constructor injection for service and repository dependencies
    public AttendanceController(AttendanceService attendanceService,
                                AttendanceRepository attendanceRepository) {
        this.attendanceService = attendanceService;
        this.attendanceRepository = attendanceRepository;
    }

    // Endpoint for employees to mark their daily attendance
    @PostMapping("/mark")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public void markAttendance(@RequestParam int hoursWorked,
                               Authentication authentication) {
        // Uses authenticated username to associate attendance with the correct employee
        attendanceService.markAttendance(authentication.getName(), hoursWorked);
    }

    // Retrieves attendance records for a specific employee within the current month
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<Attendance> getAttendanceByEmployee(@PathVariable Long employeeId) {
        return attendanceRepository.findByEmployee_IdAndDateBetween(
                employeeId,
                java.time.LocalDate.now().withDayOfMonth(1),
                java.time.LocalDate.now()
        );
    }
}