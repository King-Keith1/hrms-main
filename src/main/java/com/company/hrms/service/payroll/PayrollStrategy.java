package com.company.hrms.service.payroll;

import com.company.hrms.entity.Attendance;
import com.company.hrms.entity.Employee;
import com.company.hrms.entity.LeaveRequest;

import java.math.BigDecimal;
import java.util.List;

// Strategy interface — defines the contract for all payroll calculation strategies
public interface PayrollStrategy {
    BigDecimal calculate(Employee employee,
                         List<Attendance> attendanceList,
                         List<LeaveRequest> approvedLeaves);
}