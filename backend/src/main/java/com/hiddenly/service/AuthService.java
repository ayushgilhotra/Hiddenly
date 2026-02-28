package com.hiddenly.service;

import com.hiddenly.dto.LoginRequest;
import com.hiddenly.dto.RegisterRequest;
import com.hiddenly.model.User;
import com.hiddenly.repository.UserRepository;
import com.hiddenly.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// The @Service annotation tells Spring that this class contains the "Business Logic".
// Logic like "how to register" or "how to login" goes here, NOT in the Controller.
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // --- FUNCTION: Register a new user ---
    public String register(RegisterRequest request) {
        // 1. Check if a user with this email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        // 2. Create a new User object
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        
        // 3. ENCRYPT the password before saving (Security Best Practice)
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4. Save the user to the database
        userRepository.save(newUser);

        return "User registered successfully!";
    }

    // --- FUNCTION: Verify user login and create a JWT token ---
    public Map<String, String> login(LoginRequest request) {
        // 1. Find the user by their email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        // 2. If user exists AND password matches...
        if (userOptional.isPresent() && passwordEncoder.matches(request.getPassword(), userOptional.get().getPassword())) {
            
            // 3. Generate a JWT token for the user
            String token = jwtUtil.generateToken(request.getEmail());
            
            // 4. Return the token and user's name in a Map (JSON object)
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userName", userOptional.get().getName());
            return response;
        }

        // 5. If login fails, throw an error
        throw new RuntimeException("Invalid email or password!");
    }
}
