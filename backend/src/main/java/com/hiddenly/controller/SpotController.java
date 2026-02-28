package com.hiddenly.controller;

import com.hiddenly.dto.SpotRequest;
import com.hiddenly.model.Spot;
import com.hiddenly.service.SpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller handles all requests related to Hidden Spots.
@RestController
@RequestMapping("/api/spots")
public class SpotController {

    @Autowired
    private SpotService spotService;

    // --- API: Get all spots ---
    // URL: GET http://localhost:8080/api/spots (PUBLIC)
    @GetMapping
    public List<Spot> getAllSpots() {
        return spotService.getAllSpots();
    }

    // --- API: Get one spot by ID ---
    // URL: GET http://localhost:8080/api/spots/{id} (PUBLIC)
    @GetMapping("/{id}")
    public ResponseEntity<Spot> getSpot(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(spotService.getSpotById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- API: Add a new spot ---
    // URL: POST http://localhost:8080/api/spots (REQUIRES LOGIN)
    @PostMapping
    public ResponseEntity<?> addSpot(@RequestBody SpotRequest request) {
        try {
            // Get the current user's email from the security context
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Spot newSpot = spotService.addSpot(request, userEmail);
            return ResponseEntity.ok(newSpot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- API: Update an existing spot ---
    // URL: PUT http://localhost:8080/api/spots/{id} (REQUIRES LOGIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSpot(@PathVariable Long id, @RequestBody SpotRequest request) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Spot updatedSpot = spotService.updateSpot(id, request, userEmail);
            return ResponseEntity.ok(updatedSpot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- API: Delete a spot ---
    // URL: DELETE http://localhost:8080/api/spots/{id} (REQUIRES LOGIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSpot(@PathVariable Long id) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            spotService.deleteSpot(id, userEmail);
            return ResponseEntity.ok("Spot deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- API: Get spots by category ---
    // URL: GET http://localhost:8080/api/spots/category/{category} (PUBLIC)
    @GetMapping("/category/{category}")
    public List<Spot> getByCategory(@PathVariable String category) {
        return spotService.getSpotsByCategory(category);
    }
}
