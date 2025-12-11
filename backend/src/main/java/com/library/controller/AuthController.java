package com.library.controller;

import com.library.config.JwtUtil;
import com.library.repository.UserRepository;
import com.library.repository.ClientRepository;
import com.library.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username: " + request.getUsername());

        Map<String, String> response = authService.login(request.getUsername(), request.getPassword());

        System.out.println("=== LOGIN SUCCESS ===");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println("=== REGISTER ATTEMPT ===");
        System.out.println("Username: " + request.getUsername());

        Map<String, String> response = authService.register(
                request.getUsername(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getFatherName(),
                request.getPassportSeria(),
                request.getPassportNumber()
        );

        System.out.println("User registered successfully: " + request.getUsername());
        return ResponseEntity.ok(response);
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String firstName;
        private String lastName;
        private String fatherName;
        private String passportSeria;
        private String passportNumber;

        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getFatherName() { return fatherName; }
        public void setFatherName(String fatherName) { this.fatherName = fatherName; }
        public String getPassportSeria() { return passportSeria; }
        public void setPassportSeria(String passportSeria) { this.passportSeria = passportSeria; }
        public String getPassportNumber() { return passportNumber; }
        public void setPassportNumber(String passportNumber) { this.passportNumber = passportNumber; }
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