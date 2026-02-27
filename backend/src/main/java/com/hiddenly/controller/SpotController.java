package com.hiddenly.controller;

import com.hiddenly.model.Spot;
import com.hiddenly.service.SpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * LEARNING NOTE:
 * @RestController marks this as a web controller handling JSON.
 * We use @AuthenticationPrincipal to get the logged-in user's details directly from the JWT.
 */
@RestController
@RequestMapping("/api/spots")
@RequiredArgsConstructor
public class SpotController {

    private final SpotService spotService;

    @GetMapping
    public List<Spot> getSpots(@RequestParam(required = false) String search) {
        if (search != null) {
            return spotService.searchSpots(search);
        }
        return spotService.getAllSpots();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Spot> getSpotById(@PathVariable Long id) {
        return spotService.getSpotById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public List<Spot> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius
    ) {
        return spotService.getNearby(lat, lng, radius);
    }

    @PostMapping
    public ResponseEntity<Spot> createSpot(
            @RequestBody Spot spot,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(spotService.createSpot(spot, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Spot> updateSpot(
            @PathVariable Long id,
            @RequestBody Spot spot,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            return ResponseEntity.ok(spotService.updateSpot(id, spot, userDetails.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpot(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            spotService.deleteSpot(id, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
