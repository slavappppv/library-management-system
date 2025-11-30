package com.library.controller;

import com.library.config.JwtUtil;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username: " + request.getUsername());
        System.out.println("Password length: " + (request.getPassword() != null ? request.getPassword().length() : "null"));

        try {
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
            System.out.println("User found in DB: " + userOpt.isPresent());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("Stored password hash: " + user.getPassword());

                boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
                System.out.println("Password matches: " + passwordMatches);

                if (passwordMatches) {
                    String token = jwtUtil.generateToken(request.getUsername());
                    System.out.println("Generated token: " + token);

                    // Проверим что токен можно распарсить
                    try {
                        String extractedUsername = jwtUtil.extractUsername(token);
                        System.out.println("Token extraction test - username: " + extractedUsername);
                        boolean tokenValid = jwtUtil.validateToken(token);
                        System.out.println("Token validation test: " + tokenValid);
                    } catch (Exception e) {
                        System.out.println("Token self-test failed: " + e.getMessage());
                        e.printStackTrace();
                    }

                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());

                    System.out.println("=== LOGIN SUCCESS ===");
                    return ResponseEntity.ok(response);
                }
            }

            System.out.println("=== LOGIN FAILED ===");
            return ResponseEntity.status(401).body("Invalid credentials");

        } catch (Exception e) {
            System.out.println("Login exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println("=== REGISTER ATTEMPT ===");
        System.out.println("Username: " + request.getUsername());
        System.out.println("Password: " + request.getPassword());

        try {
            // Проверяем нет ли уже такого пользователя
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                System.out.println("Username already exists");
                return ResponseEntity.badRequest().body("Username already exists");
            }

            // Создаем нового пользователя
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("ROLE_USER"); // По умолчанию обычный пользователь
            user.setEnabled(true);

            userRepository.save(user);
            System.out.println("User registered successfully: " + request.getUsername());

            return ResponseEntity.ok("User registered successfully");

        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Registration failed");
        }
    }

    public static class RegisterRequest {
        private String username;
        private String password;

        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}