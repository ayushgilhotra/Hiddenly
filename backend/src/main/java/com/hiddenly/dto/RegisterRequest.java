package com.hiddenly.dto;

// This class is a simple container to receive registration data from the frontend.
// It doesn't connect to the database directly; it's just for moving data.
public class RegisterRequest {
    
    // The user's name, email, and password from the register form
    private String name;
    private String email;
    private String password;

    // --- GETTERS AND SETTERS ---

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
