package com.company.hrms.service;

import com.company.hrms.dto.PayslipResponse;
import com.company.hrms.entity.*;
import com.company.hrms.repository.*;
import com.company.hrms.service.payroll.PayrollStrategy;
import com.company.hrms.service.payroll.PayrollStrategyFactory;
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
    private final PayrollStrategyFactory strategyFactory;

    public PayrollService(AttendanceRepository attendanceRepository,
                          LeaveRepository leaveRepository,
                          PayrollRepository payrollRepository,
                          EmployeeRepository employeeRepository,
                          PayrollStrategyFactory strategyFactory) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.strategyFactory = strategyFactory;
    }

    public PayslipResponse generatePayroll(Long employeeId, YearMonth month) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        Payroll payroll = generatePayrollInternal(employee, month);

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

        // Attendance records
        List<Attendance> attendanceList =
                attendanceRepository.findByEmployee_IdAndDateBetween(employee.getId(), start, end);

        // Approved leaves
        List<LeaveRequest> approvedLeaves =
                leaveRepository.findByEmployee_IdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee.getId(), LeaveStatus.APPROVED, end, start);

        // Select strategy based on contract type
        PayrollStrategy strategy = strategyFactory.getStrategy(employee.getContractType());

        // Delegate calculation to strategy
        BigDecimal grossPay = strategy.calculate(employee, attendanceList, approvedLeaves);

        Payroll payroll = new Payroll(employee, payrollMonth, grossPay);
        return payrollRepository.save(payroll);
    }
}