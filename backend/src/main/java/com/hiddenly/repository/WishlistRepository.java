package com.hiddenly.repository;

import com.hiddenly.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * LEARNING NOTE:
 * Wishlist repository handles saving and retrieving user's favorite spots.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    List<Wishlist> findByUserId(Long userId);
    
    Optional<Wishlist> findByUserIdAndSpotId(Long userId, Long spotId);
    
    void deleteByUserIdAndSpotId(Long userId, Long spotId);
}
