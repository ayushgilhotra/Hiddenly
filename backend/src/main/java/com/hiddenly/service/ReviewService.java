package com.hiddenly.service;

import com.hiddenly.model.Review;
import com.hiddenly.model.Spot;
import com.hiddenly.model.User;
import com.hiddenly.repository.ReviewRepository;
import com.hiddenly.repository.SpotRepository;
import com.hiddenly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SpotRepository spotRepository;
    private final UserRepository userRepository;

    @Transactional // Ensures atomicity: if rating update fails, review isn't saved
    public Review addReview(Long spotId, Review review, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Spot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new RuntimeException("Spot not found"));

        review.setUser(user);
        review.setSpot(spot);
        Review savedReview = reviewRepository.save(review);

        // Update spot's average rating
        updateSpotAverageRating(spot);

        return savedReview;
    }

    public List<Review> getReviewsBySpot(Long spotId) {
        return reviewRepository.findBySpotId(spotId);
    }

    private void updateSpotAverageRating(Spot spot) {
        List<Review> reviews = reviewRepository.findBySpotId(spot.getId());
        if (reviews.isEmpty()) return;

        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        double avg = sum / reviews.size();
        
        spot.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        spotRepository.save(spot);
    }
}
