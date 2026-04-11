package com.company.hrms.service.payroll;

import com.company.hrms.entity.Attendance;
import com.company.hrms.entity.Employee;
import com.company.hrms.entity.LeaveRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// Contract worker: flat daily rate regardless of hours worked
@Component
public class ContractPayrollStrategy implements PayrollStrategy {

    private static final BigDecimal DAILY_RATE_MULTIPLIER = BigDecimal.valueOf(8);

    @Override
    public BigDecimal calculate(Employee employee,
                                List<Attendance> attendanceList,
                                List<LeaveRequest> approvedLeaves) {

        // Flat daily rate = hourlyRate x standard hours, regardless of actual hours
        BigDecimal dailyRate = employee.getHourlyRate()
                .multiply(DAILY_RATE_MULTIPLIER);

        return dailyRate.multiply(BigDecimal.valueOf(attendanceList.size()));
    }
}