package com.company.hrms.repository;

import com.company.hrms.entity.LeaveRequest;
import com.company.hrms.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployee_IdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            LeaveStatus status,
            LocalDate end,
            LocalDate start
    );

    List<LeaveRequest> findByEmployee_Id(Long employeeId);
}
