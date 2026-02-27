package com.hiddenly.controller;

import com.hiddenly.model.Spot;
import com.hiddenly.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<Spot> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        return wishlistService.getUserWishlist(userDetails.getUsername());
    }

    @PostMapping("/{spotId}")
    public ResponseEntity<Void> addToWishlist(
            @PathVariable Long spotId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        wishlistService.addToWishlist(spotId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{spotId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long spotId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        wishlistService.removeFromWishlist(spotId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
