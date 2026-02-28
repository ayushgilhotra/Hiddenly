package com.hiddenly.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// This filter runs exactly ONCE for every single request that comes to our backend.
// Its job is to check if the request has a valid JWT token in the header.
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Get the 'Authorization' header from the request
        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        // 2. Tokens usually start with "Bearer ", so we check for that
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Remove "Bearer " to get just the token
            try {
                email = jwtUtil.extractEmail(jwt); // Pull the email from the token
            } catch (Exception e) {
                // If the token is invalid or broken, we just ignore it
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        // 3. If we found an email and the user isn't logged in yet...
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Look up the user in our system
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            // 4. Validate the token against our registered user
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                
                // Create an "Authentication" object that Spring Security understands
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 5. Tell Spring Security that this user is now successfully logged in!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Continue with the rest of the request (go to the Controller)
        filterChain.doFilter(request, response);
    }
}
