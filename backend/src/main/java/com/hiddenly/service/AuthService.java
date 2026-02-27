package com.hiddenly.service;

import com.hiddenly.dto.AuthRequest;
import com.hiddenly.dto.AuthResponse;
import com.hiddenly.dto.RegisterRequest;
import com.hiddenly.model.User;
import com.hiddenly.repository.UserRepository;
import com.hiddenly.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * LEARNING NOTE:
 * The Service layer handles the business logic.
 * It coordinates between Repositories, Security, and external APIs.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Build a new User entity
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // ENCRYPT the password!
                .build();
        
        // Save to DB
        userRepository.save(user);
        
        // Generate tokens
        var springUser = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();
        
        var jwtToken = jwtService.generateToken(springUser);
        var refreshToken = jwtService.generateRefreshToken(springUser);
        
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .userName(user.getName())
                .userEmail(user.getEmail())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        // Let Spring handle the authentication check (email/password verification)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // If successful, find the user and generate tokens
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var springUser = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();

        var jwtToken = jwtService.generateToken(springUser);
        var refreshToken = jwtService.generateRefreshToken(springUser);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .userName(user.getName())
                .userEmail(user.getEmail())
                .build();
    }
}
