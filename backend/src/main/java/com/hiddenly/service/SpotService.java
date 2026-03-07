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

    // --- Predefined Default Images for each category ---
    private static final String[] CAFE_IMAGES = {
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        "https://images.unsplash.com/photo-1559925393-8be0ec41b511",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
    };
    private static final String[] NATURE_IMAGES = {
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b",
        "https://images.unsplash.com/photo-1426604966148-32596c592199"
    };
    private static final String[] FOOD_IMAGES = {
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
        "https://images.unsplash.com/photo-1493770348161-369560ae357d"
    };
    private static final String[] ADVENTURE_IMAGES = {
        "https://images.unsplash.com/photo-1533240332313-0bc499f50e10",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "https://images.unsplash.com/photo-1533550823359-d3ae24c801c4",
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
    };
    private static final String[] OTHER_IMAGES = {
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad",
        "https://images.unsplash.com/photo-1477346611705-65d1883cee1e",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce"
    };

    private java.util.Random random = new java.util.Random();

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
        spot.setCategory(request.getCategory().toUpperCase()); // Ensure consistency
        spot.setBudgetRange(request.getBudgetRange());
        
        // --- LOGIC: Handle Image URL ---
        String imageUrl = request.getImageUrl();
        System.out.println("DEBUG: Saving spot with imageUrl: " + imageUrl);
        
        // Check if the URL is TRULY blank/null
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            spot.setImageUrl(imageUrl.trim());
        } else {
            // Assign a random default based on category
            String[] defaults = switch (spot.getCategory()) {
                case "CAFE" -> CAFE_IMAGES;
                case "NATURE" -> NATURE_IMAGES;
                case "FOOD" -> FOOD_IMAGES;
                case "ADVENTURE" -> ADVENTURE_IMAGES;
                default -> OTHER_IMAGES;
            };
            spot.setImageUrl(defaults[random.nextInt(defaults.length)]);
        }
        spot.setPersonsCount(request.getPersonsCount());
        spot.setLatitude(request.getLatitude());
        spot.setLongitude(request.getLongitude());
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
        spot.setCategory(request.getCategory().toUpperCase());
        spot.setBudgetRange(request.getBudgetRange());
        
        // Handle image update logic (allow keeping current or changing)
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            spot.setImageUrl(request.getImageUrl());
        }
        
        spot.setPersonsCount(request.getPersonsCount());
        spot.setLatitude(request.getLatitude());
        spot.setLongitude(request.getLongitude());

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
