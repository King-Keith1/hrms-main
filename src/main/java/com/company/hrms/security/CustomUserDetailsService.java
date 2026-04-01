package com.company.hrms.security;

import com.company.hrms.entity.User;
import com.company.hrms.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service // Marks this as a Spring-managed service for dependency injection
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor-based dependency injection
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Retrieve user from database (case-insensitive)
        User user = userRepository
                .findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // Build Spring Security UserDetails object
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name().replace("ROLE_", "")) // Map enum to Spring Security roles
                .build();
    }
}