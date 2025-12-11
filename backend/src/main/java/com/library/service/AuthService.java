package com.library.service;

import com.library.exception.AuthException;
import com.library.exception.ValidationException;
import com.library.model.Client;
import com.library.model.User;
import com.library.repository.ClientRepository;
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

    @Autowired
    private ClientRepository clientRepository;

    public Map<String, String> login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("Пользователь не найден", "Неверный логин или пароль"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthException("Неверный пароль", "Неверный логин или пароль");
        }

        if (!user.getEnabled()) {
            throw new AuthException("Аккаунт отключен", "Ваш аккаунт отключен. Обратитесь к администратору.");
        }

        String token = jwtUtil.generateToken(username);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("message", "Вход выполнен успешно");

        return response;
    }

    public Map<String, String> register(String username, String password,
                                        String firstName, String lastName, String fatherName,
                                        String passportSeria, String passportNumber) {

        // Проверяем нет ли уже такого пользователя
        if (userRepository.existsByUsername(username)) {
            throw new ValidationException("Username already exists", "Пользователь с таким логином уже существует");
        }

        // Проверяем паспортные данные на уникальность
        if (clientRepository.existsByPassportSeriaAndPassportNumber(passportSeria, passportNumber)) {
            throw new ValidationException("Client with this passport already exists",
                    "Клиент с таким паспортом уже существует");
        }

        // 1. Создаем клиента
        Client client = new Client();
        client.setFirstName(firstName);
        client.setLastName(lastName);
        client.setFatherName(fatherName);
        client.setPassportSeria(passportSeria);
        client.setPassportNumber(passportNumber);
        Client savedClient = clientRepository.save(client);

        // 2. Создаем пользователя
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_READER");
        user.setEnabled(true);
        user.setClient(savedClient);

        User savedUser = userRepository.save(user);

        // 3. Генерируем токен и возвращаем его (как при логине)
        String token = jwtUtil.generateToken(username);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", savedUser.getUsername());
        response.put("role", savedUser.getRole());
        response.put("message", "Регистрация прошла успешно");

        return response;
    }
}