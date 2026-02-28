package com.hiddenly.controller;

import com.hiddenly.dto.LoginRequest;
import com.hiddenly.dto.RegisterRequest;
import com.hiddenly.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// This controller handles all requests related to Users (Registration and Login)
// @RestController means this class will send back data (JSON), not HTML pages.
// @RequestMapping("/api/auth") means all URLs in this class start with /api/auth
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // --- API: Register a new user ---
    // URL: POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            // Return 200 OK with success message
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            // Return 400 Bad Request if something goes wrong (like email already exists)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- API: Login an existing user ---
    // URL: POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, String> response = authService.login(request);
            // Return 200 OK with the token and user name
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Return 401 Unauthorized if login fails
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
