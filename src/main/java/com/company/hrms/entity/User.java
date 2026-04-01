package com.company.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users") // Stores application users for authentication and authorization
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @Column(unique = true, nullable = false)
    private String username; // Login username, unique

    @Column(nullable = false)
    private String password; // Encrypted password

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // User role (e.g., EMPLOYEE, MANAGER, ADMIN)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Avoid lazy-load serialization issues
    private Department department; // Department the user belongs to (optional for some roles)

    // Protected no-args constructor required by JPA
    protected User() {}

    // Convenience constructor
    public User(String username, String password, Role role, Department department) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.department = department;
    }

    // --- UserDetails Implementation for Spring Security ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name())); // Map Role enum to GrantedAuthority
    }
    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true; // All accounts are non-expired by default
    }
    @Override
    public boolean isAccountNonLocked() {
        return true; // All accounts are non-locked by default
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }
    @Override
    public boolean isEnabled() {
        return true; // All users are enabled by default
    }

    // --- GETTERS ---
    public Long getId() {
        return id;
    }
    public Role getRole() {
        return role;
    }
    public Department getDepartment() {
        return department;
    }

    // --- SETTERS ---
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
}