package com.company.hrms.repository;

import com.company.hrms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployee_IdAndDate(Long employeeId, LocalDate date);

    List<Attendance> findByEmployee_IdAndDateBetween(
            Long employeeId,
            LocalDate start,
            LocalDate end
    );
}