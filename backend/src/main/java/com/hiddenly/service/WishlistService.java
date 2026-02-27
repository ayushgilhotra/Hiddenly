package com.hiddenly.service;

import com.hiddenly.model.Spot;
import com.hiddenly.model.User;
import com.hiddenly.model.Wishlist;
import com.hiddenly.repository.SpotRepository;
import com.hiddenly.repository.UserRepository;
import com.hiddenly.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final SpotRepository spotRepository;
    private final UserRepository userRepository;

    public void addToWishlist(Long spotId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Spot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new RuntimeException("Spot not found"));

        if (wishlistRepository.findByUserIdAndSpotId(user.getId(), spot.getId()).isEmpty()) {
            Wishlist item = Wishlist.builder()
                    .user(user)
                    .spot(spot)
                    .build();
            wishlistRepository.save(item);
        }
    }

    public void removeFromWishlist(Long spotId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        wishlistRepository.deleteByUserIdAndSpotId(user.getId(), spotId);
    }

    public List<Spot> getUserWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUserId(user.getId())
                .stream()
                .map(Wishlist::getSpot)
                .collect(Collectors.toList());
    }
}
