package com.company.hrms.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SystemClockService {

    private LocalDate currentDate = LocalDate.now();

    public LocalDate today() {
        return currentDate;
    }

    public void advanceDay() {
        currentDate = currentDate.plusDays(1);
    }
}
