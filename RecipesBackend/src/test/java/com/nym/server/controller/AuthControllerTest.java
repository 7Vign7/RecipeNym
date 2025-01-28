package com.nym.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nym.server.dto.AuthRequest;
import com.nym.server.model.User;
import com.nym.server.repository.UserRepository;
import com.nym.server.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtService jwtService;

    private AuthRequest authRequest;

    @BeforeEach
    void setup() {
        authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        // Arrange
        Mockito.when(userRepository.existsByUsername(authRequest.getEmail())).thenReturn(false);
        Mockito.when(passwordEncoder.encode(authRequest.getPassword())).thenReturn("encodedPassword");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(authRequest.getEmail()));
    }

    @Test
    void testRegisterUser_UserAlreadyExists() throws Exception {
        // Arrange
        Mockito.when(userRepository.existsByUsername(authRequest.getEmail())).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Пользователь уже существует!"));
    }

    @Test
    void testLoginUser_InvalidCredentials() throws Exception {
        // Arrange
        Mockito.when(userRepository.findByUsername(authRequest.getEmail())).thenReturn(Optional.empty());
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Неверный логин!"));
    }
}
