package com.company.hrms.repository;

import com.company.hrms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByName(String name);

}