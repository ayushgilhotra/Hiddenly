package com.hiddenly.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * LEARNING NOTE:
 * This is the main Security Configuration.
 * We disable CSRF because JWTs are stateless and often stored in headers (protected from CSRF).
 * We set session management to STATELESS because we don't want Spring to create sessions.
 * We configure which routes are public (login, register, swagger) and which are private.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF as we use JWT
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",      // Public auth endpoints
                    "/v3/api-docs/**",   // Swagger docs
                    "/swagger-ui/**",    // Swagger UI
                    "/api/spots/**",     // Make viewing spots public for now (read-only)
                    "/api/reviews/spot/**"
                ).permitAll()
                .anyRequest().authenticated() // All other requests need a token
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions!
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add our JWT filter

        return http.build();
    }
}
