package com.hiddenly.config;

import com.hiddenly.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// This class is the "Command Center" for all security settings.
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // This method defines WHICH pages are public and WHICH need a login.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF (not needed for JWT based APIs)
            .cors(cors -> cors.configure(http)) // Enable CORS so our frontend can talk to backend
            // Define access rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Anyone can Register or Login
                .requestMatchers(HttpMethod.GET, "/api/spots/**").permitAll() // Anyone can browse spots
                .requestMatchers("/api/upload/**").permitAll() // Troubleshooting: Allow uploads
                .requestMatchers("/uploads/**").permitAll() // Allow everyone to see uploaded images
                .anyRequest().authenticated() // Everything else (Add/Edit/Review) needs a login
            )
            // We don't want Spring to create a Session (because we are using JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Tell Spring to use our JwtFilter before the standard login filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // This Bean is used to encrypt passwords using BCrypt algorithm.
    // We NEVER store plain text passwords in the database!
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Helper for checking login credentials
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
