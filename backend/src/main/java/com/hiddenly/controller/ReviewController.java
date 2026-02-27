package com.hiddenly.controller;

import com.hiddenly.model.Review;
import com.hiddenly.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/spot/{spotId}")
    public List<Review> getReviewsBySpot(@PathVariable Long spotId) {
        return reviewService.getReviewsBySpot(spotId);
    }

    @PostMapping("/spot/{spotId}")
    public ResponseEntity<Review> addReview(
            @PathVariable Long spotId,
            @RequestBody Review review,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(reviewService.addReview(spotId, review, userDetails.getUsername()));
    }
}
