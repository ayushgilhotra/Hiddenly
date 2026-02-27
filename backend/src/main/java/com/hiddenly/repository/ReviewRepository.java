package com.hiddenly.repository;

import com.hiddenly.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * LEARNING NOTE:
 * Repositories keep our data access logic clean.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Get all reviews for a specific spot
    List<Review> findBySpotId(Long spotId);
    
    // Get reviews by a specific user
    List<Review> findByUserId(Long userId);
}
