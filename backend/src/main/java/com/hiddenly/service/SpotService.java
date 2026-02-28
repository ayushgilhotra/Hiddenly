package com.hiddenly.service;

import com.hiddenly.dto.SpotRequest;
import com.hiddenly.model.Spot;
import com.hiddenly.model.User;
import com.hiddenly.repository.SpotRepository;
import com.hiddenly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// This service handles all the logic for adding, viewing, and deleting hidden spots.
@Service
public class SpotService {

    @Autowired
    private SpotRepository spotRepository;

    @Autowired
    private UserRepository userRepository;

    // --- FUNCTION: Get all spots from the database ---
    public List<Spot> getAllSpots() {
        return spotRepository.findAll();
    }

    // --- FUNCTION: Find one spot by its unique ID ---
    public Spot getSpotById(Long id) {
        return spotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spot not found with id: " + id));
    }

    // --- FUNCTION: Add a new spot to the database ---
    public Spot addSpot(SpotRequest request, String userEmail) {
        // 1. Find the user who is adding this spot (from their email in the token)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Create a new Spot object from the request data
        Spot spot = new Spot();
        spot.setName(request.getName());
        spot.setDescription(request.getDescription());
        spot.setLocation(request.getLocation());
        spot.setCategory(request.getCategory());
        spot.setBudgetRange(request.getBudgetRange());
        spot.setImageUrl(request.getImageUrl());
        spot.setAddedBy(user); // Set the relationship

        // 3. Save the spot to the database
        return spotRepository.save(spot);
    }

    // --- FUNCTION: Update an existing spot ---
    public Spot updateSpot(Long id, SpotRequest request, String userEmail) {
        Spot spot = getSpotById(id);

        // Security Check: Only the person who added it can edit it
        if (!spot.getAddedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to edit this spot!");
        }

        // Update fields
        spot.setName(request.getName());
        spot.setDescription(request.getDescription());
        spot.setLocation(request.getLocation());
        spot.setCategory(request.getCategory());
        spot.setBudgetRange(request.getBudgetRange());
        spot.setImageUrl(request.getImageUrl());

        return spotRepository.save(spot);
    }

    // --- FUNCTION: Delete a spot ---
    public void deleteSpot(Long id, String userEmail) {
        Spot spot = getSpotById(id);

        // Security Check: Only the person who added it can delete it
        if (!spot.getAddedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to delete this spot!");
        }

        spotRepository.delete(spot);
    }

    // --- FUNCTION: Get spots by category (CAFE, NATURE, etc.) ---
    public List<Spot> getSpotsByCategory(String category) {
        return spotRepository.findByCategory(category);
    }
}
