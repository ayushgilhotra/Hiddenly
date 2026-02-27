package com.hiddenly.repository;

import com.hiddenly.model.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * LEARNING NOTE:
 * You can write custom queries using @Query.
 * This repository handles searching for spots by various filters.
 */
@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {

    // Simple search by name (case-insensitive)
    List<Spot> findByNameContainingIgnoreCase(String name);

    // Search by category
    List<Spot> findByCategory(String category);

    /**
     * Finds spots within a certain radius using the Haversine formula.
     * Note: For advanced GIS, you'd use PostGIS, but this works for basic needs.
     */
    @Query(value = "SELECT * FROM spots s WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(s.latitude)) * " +
           "cos(radians(s.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(s.latitude)))) < :radius", 
           nativeQuery = true)
    List<Spot> findNearbySpots(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);
}
