package com.company.hrms.service.payroll;

import com.company.hrms.entity.Attendance;
import com.company.hrms.entity.Employee;
import com.company.hrms.entity.LeaveRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// Part time: only pays for actual hours worked, no overtime, no paid leave
@Component
public class PartTimePayrollStrategy implements PayrollStrategy {

    @Override
    public BigDecimal calculate(Employee employee,
                                List<Attendance> attendanceList,
                                List<LeaveRequest> approvedLeaves) {

        BigDecimal total = BigDecimal.ZERO;

        // Only regular hours — no overtime, no leave pay
        for (Attendance a : attendanceList) {
            BigDecimal pay = employee.getHourlyRate()
                    .multiply(BigDecimal.valueOf(a.getHoursWorked()));
            total = total.add(pay);
        }

        return total;
    }
}