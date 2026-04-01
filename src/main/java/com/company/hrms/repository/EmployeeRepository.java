package com.company.hrms.repository;

import com.company.hrms.entity.Employee;
import com.company.hrms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDepartment_Id(Long departmentId);

    Optional<Employee> findByUserUsername(String username);

    Optional<Employee> findByEmployeeNumber(String employeeNumber);

}