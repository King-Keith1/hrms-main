package com.company.hrms.service;

import com.company.hrms.dto.CreateEmployeeRequest;
import com.company.hrms.entity.Department;
import com.company.hrms.entity.Employee;
import com.company.hrms.entity.Role;
import com.company.hrms.entity.User;
import com.company.hrms.repository.DepartmentRepository;
import com.company.hrms.repository.EmployeeRepository;
import com.company.hrms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository,
                           DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    public Employee createEmployee(CreateEmployeeRequest request, String creatorUsername) {

        //Retrieve the user performing the action
        User creator = userRepository.findByUsernameIgnoreCase(creatorUsername)
                .orElseThrow(() -> new RuntimeException("User not found: " + creatorUsername));

        //Retrieve the department
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new RuntimeException("Department not found: " + request.departmentId()));

        //Restrict managers to their own department
        if (creator.getRole() == Role.ROLE_MANAGER) {
            if (creator.getDepartment() == null) {
                throw new RuntimeException("Manager has no department assigned");
            }
            if (!creator.getDepartment().getId().equals(department.getId())) {
                throw new RuntimeException("Managers can only create employees in their own department");
            }
        }

        //Check for duplicate employee number
        if (employeeRepository.findByEmployeeNumber(request.employeeNumber()).isPresent()) {
            throw new RuntimeException("Employee number already exists: " + request.employeeNumber());
        }

        //Create Employee entity
        Employee employee = new Employee(
                request.fullName(),
                request.employeeNumber(),
                department,
                request.hourlyRate()
        );

        // Optionally link an existing User account if username provided
        if (request.username() != null && !request.username().isBlank()) {
            User linkedUser = userRepository.findByUsernameIgnoreCase(request.username())
                    .orElseThrow(() -> new RuntimeException("User not found: " + request.username()));
            employee.setUser(linkedUser);
        }

        return employeeRepository.save(employee);
    }
}