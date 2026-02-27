package com.hiddenly.repository;

import com.hiddenly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * LEARNING NOTE:
 * JpaRepository provides stay-of-the-art methods for CRUD (Create, Read, Update, Delete).
 * We just define an interface, and Spring Data JPA generates the implementation!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring generates a query based on the method name!
    // This will run "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
