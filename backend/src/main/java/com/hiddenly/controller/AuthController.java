package com.hiddenly.controller;

import com.hiddenly.dto.AuthRequest;
import com.hiddenly.dto.AuthResponse;
import com.hiddenly.dto.RegisterRequest;
import com.hiddenly.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * LEARNING NOTE:
 * This is a REST Controller. @RestController means every method returns JSON automatically.
 * @RequestMapping sets the base URL for all routes in this class.
 * We separate Controller (receives request) from Service (does the logic) from Repository (talks to DB).
 * This pattern is called "Separation of Concerns" - a key software design principle.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
