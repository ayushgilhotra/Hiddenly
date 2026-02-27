package com.hiddenly.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * LEARNING NOTE:
 * @Entity marks this class as a JPA entity that maps to a database table.
 * @Table specifies the name of the table in the database.
 * Lombok's @Data, @NoArgsConstructor, and @AllArgsConstructor generate boilerplate code like getters, setters, and constructors automatically.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Database handles ID generation (auto-increment)
    private Long id;

    @Column(nullable = false, length = 100) // Column constraints (not null, length)
    private String name;

    @Column(nullable = false, unique = true, length = 150) // Emails must be unique
    private String email;

    @Column(nullable = false) // Passwords are required
    private String password;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist // Runs before the entity is saved to the database for the first time
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }
}
