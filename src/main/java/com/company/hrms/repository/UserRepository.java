package com.company.hrms.repository;

import com.company.hrms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.entity.Role;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByUsername(String username);

    List<User> findByRole(Role role);

}