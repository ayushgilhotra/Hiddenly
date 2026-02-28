package com.hiddenly.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// This class provides helper methods to create, read, and validate JWT (JSON Web Tokens).
// We mark it with @Component so Spring can automatically create an instance for us to use.
@Component
public class JwtUtil {

    // We read the secret key from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // We read the expiration time (how long a token lasts) from application.properties
    @Value("${jwt.expiration}")
    private long expiration;

    // Helper to get the signing key from the secret string
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --- FUNCTION: Create a new token for a user after they login ---
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        // We use the email as the 'subject' of the token
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // The token will expire after 'expiration' milliseconds (e.g., 24 hours)
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                // We sign the token with our secret key
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // --- FUNCTION: Extract the user's email from a token ---
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // --- FUNCTION: Check if a token is still valid (not expired and matches user) ---
    public Boolean validateToken(String token, String userEmail) {
        final String email = extractEmail(token);
        return (email.equals(userEmail) && !isTokenExpired(token));
    }

    // --- HELPER FUNCTIONS (Internal use only) ---

    // Checks if the token's expiration date is in the past
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Gets the expiration date from the token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic function to pull any piece of data (claim) from the token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Decodes the token using our secret key to see all the data inside
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
