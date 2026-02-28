package com.hiddenly.dto;

// This class is used when a user tries to login.
// It only needs the email and password from the login form.
public class LoginRequest {
    
    private String email;
    private String password;

    // --- GETTERS AND SETTERS ---

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
