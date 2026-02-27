package com.hiddenly.service;

import com.hiddenly.model.Spot;
import com.hiddenly.model.User;
import com.hiddenly.repository.SpotRepository;
import com.hiddenly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * LEARNING NOTE:
 * SpotService handles everything related to discovering and adding locations.
 */
@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final UserRepository userRepository;

    public List<Spot> getAllSpots() {
        return spotRepository.findAll();
    }

    public Optional<Spot> getSpotById(Long id) {
        return spotRepository.findById(id);
    }

    public List<Spot> searchSpots(String name) {
        return spotRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Spot> getNearby(double lat, double lng, double radius) {
        return spotRepository.findNearbySpots(lat, lng, radius);
    }

    public Spot createSpot(Spot spot, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        spot.setAddedBy(user);
        return spotRepository.save(spot);
    }

    public Spot updateSpot(Long id, Spot spotDetails, String userEmail) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spot not found"));

        // Only the owner can update (basic check)
        if (!spot.getAddedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to update this spot");
        }

        spot.setName(spotDetails.getName());
        spot.setDescription(spotDetails.getDescription());
        spot.setCategory(spotDetails.getCategory());
        spot.setBudgetMin(spotDetails.getBudgetMin());
        spot.setBudgetMax(spotDetails.getBudgetMax());
        spot.setLatitude(spotDetails.getLatitude());
        spot.setLongitude(spotDetails.getLongitude());
        spot.setAddress(spotDetails.getAddress());
        spot.setImageUrls(spotDetails.getImageUrls());

        return spotRepository.save(spot);
    }

    public void deleteSpot(Long id, String userEmail) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spot not found"));

        if (!spot.getAddedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this spot");
        }

        spotRepository.delete(spot);
    }
}
