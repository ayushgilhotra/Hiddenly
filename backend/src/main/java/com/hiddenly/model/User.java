package com.hiddenly.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// This class represents the 'users' table in our MySQL database.
// The @Entity annotation tells Spring Data JPA that this class should be mapped to a table.
@Entity
@Table(name = "users") // We explicitly name the table 'users'
public class User {

    // This is the primary key (id) for our user.
    // @Id marks it as the unique identifier.
    // @GeneratedValue means it will automatically increment (1, 2, 3...) in the database.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user's full name.
    @Column(nullable = false) // 'nullable = false' means this field is required
    private String name;

    // The user's email, which must be unique (no two users can have the same email).
    @Column(nullable = false, unique = true)
    private String email;

    // The user's password (this will be stored as an encrypted string).
    @Column(nullable = false)
    private String password;

    // The date and time when the user was created.
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- CONSTRUCTORS (How we create a User object) ---

    // A default constructor is REQUIRED by JPA
    public User() {}

    // A constructor with parameters to make it easy to create a new user
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // --- GETTERS AND SETTERS (How we read and write the private fields) ---
    // We use these because our fields are private (a concept called Encapsulation)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
