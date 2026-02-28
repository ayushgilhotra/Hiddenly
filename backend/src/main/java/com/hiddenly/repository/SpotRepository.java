package com.hiddenly.repository;

import com.hiddenly.model.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// This repository handles all database operations for the Spot entity.
public interface SpotRepository extends JpaRepository<Spot, Long> {
    
    // This method finds all spots that belong to a specific category (like CAFE or NATURE).
    // Spring will automatically generate the SQL: "SELECT * FROM spots WHERE category = ?"
    List<Spot> findByCategory(String category);
    
    // This method finds all spots that contain a certain name (case-insensitive search).
    // Helpful for the search bar on the home page.
    List<Spot> findByNameContainingIgnoreCase(String name);
}
