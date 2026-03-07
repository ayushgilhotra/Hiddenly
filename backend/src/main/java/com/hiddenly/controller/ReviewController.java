package com.hiddenly.controller;

import com.hiddenly.dto.ReviewRequest;
import com.hiddenly.model.Review;
import com.hiddenly.model.Spot;
import com.hiddenly.model.User;
import com.hiddenly.repository.ReviewRepository;
import com.hiddenly.repository.SpotRepository;
import com.hiddenly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SpotRepository spotRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Spot spot = spotRepository.findById(request.getSpotId())
                    .orElseThrow(() -> new RuntimeException("Spot not found"));

            Review review = new Review();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setUser(user);
            review.setSpot(spot);

            Review savedReview = reviewRepository.save(review);

            // Update average rating for the spot
            updateSpotAverageRating(spot);

            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private void updateSpotAverageRating(Spot spot) {
        List<Review> reviews = spot.getReviews();
        if (reviews.isEmpty()) {
            spot.setAverageRating(0.0);
        } else {
            double sum = 0;
            for (Review r : reviews) {
                sum += r.getRating();
            }
            spot.setAverageRating(sum / reviews.size());
        }
        spotRepository.save(spot);
    }
}
