package com.company.hrms.service;

import com.company.hrms.dto.PayslipResponse;
import com.company.hrms.entity.*;
import com.company.hrms.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class PayrollService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(AttendanceRepository attendanceRepository,
                          LeaveRepository leaveRepository,
                          PayrollRepository payrollRepository,
                          EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public PayslipResponse generatePayroll(Long employeeId, YearMonth month) {

        //Lookups employee
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        //Generates payroll internally
        Payroll payroll = generatePayrollInternal(employee, month);

        //Return DTO for API
        return new PayslipResponse(
                employee.getFullName(),
                month,
                payroll.getGrossPay()
        );
    }

    private Payroll generatePayrollInternal(Employee employee, YearMonth month) {

        String payrollMonth = month.toString();

        // Prevent duplicate payroll generation
        if (payrollRepository.existsByEmployee_IdAndPayrollMonth(employee.getId(), payrollMonth)) {
            throw new RuntimeException("Payroll already generated for " + payrollMonth);
        }

        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        //Get attendance within the month
        List<Attendance> attendanceList =
                attendanceRepository.findByEmployee_IdAndDateBetween(employee.getId(), start, end);

        BigDecimal total = BigDecimal.ZERO;

        //Compute pay for each attendance record
        for (Attendance a : attendanceList) {
            BigDecimal dailyPay = employee.getHourlyRate()
                    .multiply(BigDecimal.valueOf(a.getHoursWorked()))
                    .add(employee.getHourlyRate()
                            .multiply(BigDecimal.valueOf(a.getOvertimeHours()))
                            .multiply(BigDecimal.valueOf(1.5)) // overtime multiplier
                    );
            total = total.add(dailyPay);
        }

        //Add approved PAID leave pay
        List<LeaveRequest> leaves = leaveRepository
                .findByEmployee_IdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee.getId(),
                        LeaveStatus.APPROVED,
                        end,
                        start
                );

        for (LeaveRequest leave : leaves) {
            if (leave.getType() == LeaveType.PAID) {
                long days = leave.getEndDate().toEpochDay() - leave.getStartDate().toEpochDay() + 1;
                BigDecimal leavePay = employee.getHourlyRate()
                        .multiply(BigDecimal.valueOf(employee.getStandardHoursPerDay() * days));
                total = total.add(leavePay);
            }
        }

        //Save payroll
        Payroll payroll = new Payroll(employee, payrollMonth, total);
        return payrollRepository.save(payroll);
    }
}