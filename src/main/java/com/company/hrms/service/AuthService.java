package com.company.hrms.service;

import com.company.hrms.dto.*;
import com.company.hrms.entity.*;
import com.company.hrms.repository.*;
import com.company.hrms.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        // Check if username already exists
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }

        // Retrieve department entity
        Department department = departmentRepository
                .findById(request.departmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // Normalize role string to ensure it starts with ROLE_
        String roleStr = request.role().toUpperCase();
        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr;
        }

        // Create new User entity with hashed password
        User user = new User(
                request.username(),
                passwordEncoder.encode(request.password()),
                Role.valueOf(roleStr),
                department
        );

        // Persist user
        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse login(LoginRequest request) {

        // Retrieve user by username
        User user = userRepository.findByUsernameIgnoreCase(request.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer");
    }
}