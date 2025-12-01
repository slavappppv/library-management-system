package com.library.config;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import com.library.model.User;
import com.library.repository.UserRepository;

@Component
public class JwtUtil {
    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final long expirationMs = 86400000;

    @Autowired
    private UserRepository userRepository;

    public JwtUtil() {
        try {
            System.out.println("=== JWT UTIL INITIALIZATION ===");
            this.privateKey = loadPrivateKey();
            this.publicKey = loadPublicKey();
            System.out.println("RSA Keys loaded successfully");
            System.out.println("Private key algorithm: " + privateKey.getAlgorithm());
            System.out.println("Public key algorithm: " + publicKey.getAlgorithm());
        } catch (Exception e) {
            System.out.println("Failed to load JWT keys: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to load JWT keys", e);
        }
    }

    private PrivateKey loadPrivateKey() throws Exception {
        System.out.println("Loading private key...");
        String privateKeyPEM = new String(new ClassPathResource("keys/private.pem").getInputStream().readAllBytes())
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }

    private PublicKey loadPublicKey() throws Exception {
        System.out.println("Loading public key...");
        String publicKeyPEM = new String(new ClassPathResource("keys/public.pem").getInputStream().readAllBytes())
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }

    public String generateToken(String username) {
        System.out.println("Generating token for username: " + username);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
        System.out.println("Token generated with RS256 algorithm");
        return token;
    }

    public String extractUsername(String token) {
        System.out.println("Extracting username from token...");
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            System.out.println("Username extracted: " + username);
            return username;
        } catch (Exception e) {
            System.out.println("Failed to extract username: " + e.getMessage());
            throw e;
        }
    }

    public boolean validateToken(String token) {
        System.out.println("Validating token...");
        try {
            Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(token);
            System.out.println("Token validation: SUCCESS");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Token validation: FAILED - " + e.getMessage());
            return false;
        }
    }
}