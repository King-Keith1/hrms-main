package com.company.hrms.repository;

import com.company.hrms.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    boolean existsByEmployee_IdAndPayrollMonth(Long employeeId, String payrollMonth);

    List<Payroll> findByEmployee_Id(Long employeeId);

}
