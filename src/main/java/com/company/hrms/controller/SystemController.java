package com.company.hrms.controller;

import com.company.hrms.service.SystemClockService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system") // System-level administrative operations
public class SystemController {

    private final SystemClockService clockService;

    // Constructor injection for system clock service
    public SystemController(SystemClockService clockService) {
        this.clockService = clockService;
    }

    // Advances the application system date by one day (admin/manager only)
    @PostMapping("/next-day")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public String advanceDay() {
        clockService.advanceDay(); // Delegates date change to service layer
        return "System date advanced to next day";
    }
    @GetMapping("/current-date")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EMPLOYEE')")
    public String getCurrentDate() {
        return clockService.today().toString();
    }
}