package com.company.hrms.controller;

import com.company.hrms.entity.LeaveRequest;
import com.company.hrms.entity.LeaveType;
import com.company.hrms.repository.LeaveRepository;
import com.company.hrms.service.LeaveService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/leaves") // REST endpoints for employee leave management
public class LeaveController {

    private final LeaveService leaveService;
    private final LeaveRepository leaveRepository;

    // Constructor injection for leave service and repository
    public LeaveController(LeaveService leaveService,
                           LeaveRepository leaveRepository) {
        this.leaveService = leaveService;
        this.leaveRepository = leaveRepository;
    }

    // Allows an employee to submit a leave request
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public LeaveRequest requestLeave(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam LeaveType type,
            Authentication auth) {

        // Uses authenticated username to associate leave with the correct employee
        return leaveService.requestLeave(auth.getName(), startDate, endDate, type);
    }

    // Approves a pending leave request (manager/admin only)
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_ADMIN')")
    public void approveLeave(@PathVariable Long id) {
        leaveService.approveLeave(id);
    }

    // Retrieves all leave requests in the system
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // Retrieves leave requests for the currently authenticated employee
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
    public List<LeaveRequest> getMyLeaves(Authentication auth) {
        return leaveService.getLeavesByUsername(auth.getName());
    }
}