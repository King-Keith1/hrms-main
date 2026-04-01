package com.company.hrms.service;

import com.company.hrms.entity.Employee;
import com.company.hrms.entity.LeaveRequest;
import com.company.hrms.entity.LeaveStatus;
import com.company.hrms.entity.LeaveType;
import com.company.hrms.repository.EmployeeRepository;
import com.company.hrms.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(LeaveRepository leaveRepository,
                        EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    public LeaveRequest requestLeave(
            String username,
            LocalDate startDate,
            LocalDate endDate,
            LeaveType type) {

        //Validate date range
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        //Lookups employee
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + username));

        //Build leave request
        LeaveRequest leave = new LeaveRequest(
                employee,
                startDate,
                endDate,
                type
        );

        //Persist
        return leaveRepository.save(leave);
    }

    public List<LeaveRequest> getLeavesByUsername(String username) {

        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + username));

        return leaveRepository.findByEmployee_Id(employee.getId());
    }

    public void approveLeave(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found: " + id));

        leave.setStatus(LeaveStatus.APPROVED);

        leaveRepository.save(leave);
    }
}