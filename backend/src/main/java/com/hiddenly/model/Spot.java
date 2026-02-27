package com.hiddenly.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * LEARNING NOTE:
 * This entity represents a "Hidden Spot" in the system.
 * We use @ManyToOne to link it to the User who added it.
 * JSONB is handled using Hibernate's @JdbcTypeCode to store lists of strings directly in PostgreSQL.
 */
@Entity
@Table(name = "spots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Spot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "budget_min", precision = 10, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", precision = 10, scale = 2)
    private BigDecimal budgetMax;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @JdbcTypeCode(SqlTypes.JSON) // Tells Hibernate to handle this as JSON in the database
    @Column(name = "image_urls", columnDefinition = "jsonb")
    private List<String> imageUrls;

    @ManyToOne(fetch = FetchType.LAZY) // Many spots can be added by one user
    @JoinColumn(name = "added_by") // This is the foreign key column name
    private User addedBy;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        if (averageRating == null) {
            averageRating = BigDecimal.ZERO;
        }
    }
}
