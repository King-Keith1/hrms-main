package com.company.hrms.controller;

import com.company.hrms.dto.AuthResponse;
import com.company.hrms.dto.LoginRequest;
import com.company.hrms.dto.RegisterRequest;
import com.company.hrms.entity.User;
import com.company.hrms.repository.UserRepository;
import com.company.hrms.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public User me(Authentication authentication) {
        return userRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}