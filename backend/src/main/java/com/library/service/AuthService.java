package com.library.service;

import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Метод для входа
    public Map<String, String> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            User user = userOpt.get();
            if (user.getEnabled()) {
                String token = jwtUtil.generateToken(username);
                response.put("token", token);
                response.put("role", user.getRole());
                response.put("message", "Login successful");
            } else {
                response.put("error", "Account is disabled");
            }
        } else {
            response.put("error", "Invalid username or password");
        }
        return response;
    }

    // Метод для регистрации новых пользователей
    public Map<String, String> register(String username, String password) {
        Map<String, String> response = new HashMap<>();

        // Проверяем, не занят ли username
        if (userRepository.existsByUsername(username)) {
            response.put("error", "Username already exists");
            return response;
        }

        // Создаем нового пользователя с ролью READER
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole("READER");  // Обычные пользователи - читатели
        newUser.setEnabled(true);

        userRepository.save(newUser);

        response.put("message", "Registration successful");
        return response;
    }
}