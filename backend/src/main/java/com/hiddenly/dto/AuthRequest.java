package com.hiddenly.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LEARNING NOTE:
 * DTOs (Data Transfer Objects) are used to transfer data between the client and server.
 * We don't want to expose our raw Entity (like password fields) to the frontend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
    private String email;
    private String password;
}
