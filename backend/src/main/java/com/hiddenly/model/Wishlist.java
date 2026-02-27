package com.hiddenly.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * LEARNING NOTE:
 * Wishlist is a simple mapping entity.
 * In a real-world high-scale app, we might use a Many-to-Many join table,
 * but an entity gives us more control if we want to add "addedDate" later.
 */
@Entity
@Table(name = "wishlist", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "spot_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;
}
