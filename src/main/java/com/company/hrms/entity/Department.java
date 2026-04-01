package com.company.hrms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments") // Stores company departments
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @Column(unique = true, nullable = false, length = 100) // Department name must be unique and not null
    private String name;

    // Protected no-args constructor required by JPA
    protected Department() {}

    // Convenience constructor for creating a new department
    public Department(String name) {
        this.name = name;
    }

    // --- GETTERS ---
    public Long getId() { return id; }
    public String getName() { return name; }

    // --- SETTERS ---
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
}