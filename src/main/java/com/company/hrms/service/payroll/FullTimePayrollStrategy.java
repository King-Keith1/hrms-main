package com.company.hrms.service.payroll;

import com.company.hrms.entity.Attendance;
import com.company.hrms.entity.Employee;
import com.company.hrms.entity.LeaveRequest;
import com.company.hrms.entity.LeaveType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// Full time: regular pay + overtime at 1.5x + paid leave at standard daily rate
@Component
public class FullTimePayrollStrategy implements PayrollStrategy {

    @Override
    public BigDecimal calculate(Employee employee,
                                List<Attendance> attendanceList,
                                List<LeaveRequest> approvedLeaves) {

        BigDecimal total = BigDecimal.ZERO;

        // Calculate attendance pay including overtime
        for (Attendance a : attendanceList) {
            BigDecimal regular = employee.getHourlyRate()
                    .multiply(BigDecimal.valueOf(a.getHoursWorked()));
            BigDecimal overtime = employee.getHourlyRate()
                    .multiply(BigDecimal.valueOf(a.getOvertimeHours()))
                    .multiply(BigDecimal.valueOf(1.5));
            total = total.add(regular).add(overtime);
        }

        // Add paid leave pay
        for (LeaveRequest leave : approvedLeaves) {
            if (leave.getType() == LeaveType.PAID) {
                long days = leave.getEndDate().toEpochDay()
                        - leave.getStartDate().toEpochDay() + 1;
                BigDecimal leavePay = employee.getHourlyRate()
                        .multiply(BigDecimal.valueOf(employee.getStandardHoursPerDay() * days));
                total = total.add(leavePay);
            }
        }

        return total;
    }
}