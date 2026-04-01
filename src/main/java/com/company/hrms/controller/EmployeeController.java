package com.company.hrms.controller;

import com.company.hrms.dto.CreateEmployeeRequest;
import com.company.hrms.entity.Employee;
import com.company.hrms.repository.EmployeeRepository;
import com.company.hrms.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees") // REST endpoints for employee management
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;

    // Constructor injection for service and repository dependencies
    public EmployeeController(EmployeeService employeeService,
                              EmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
    }

    // Creates a new employee record (restricted to admin/manager roles)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public Employee createEmployee(@RequestBody @Valid CreateEmployeeRequest request,
                                   Authentication authentication) {
        // Pass authenticated user to service for auditing or permission checks
        return employeeService.createEmployee(request, authentication.getName());
    }

    // Retrieves all employees in the system
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Retrieves a specific employee by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
    }

    // Retrieves employees belonging to a specific department
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public List<Employee> getEmployeesByDepartment(@PathVariable Long departmentId) {
        return employeeRepository.findByDepartment_Id(departmentId);
    }
}