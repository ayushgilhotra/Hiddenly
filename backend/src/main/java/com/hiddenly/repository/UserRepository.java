package com.hiddenly.repository;

import com.hiddenly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// A Repository is like a bridge between our Java code and the database.
// By extending JpaRepository, Spring automatically gives us methods like save(), delete(), findById(), etc.
// We specify <User, Long> because this repository is for the User entity, and its ID is of type Long.
public interface UserRepository extends JpaRepository<User, Long> {
    
    // This custom method allows us to find a user by their email address.
    // Spring is smart enough to create the SQL query for this automatically!
    // We use Optional because a user might not exist with a given email.
    Optional<User> findByEmail(String email);
}
