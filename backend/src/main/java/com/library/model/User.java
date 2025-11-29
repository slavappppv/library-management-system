package com.library.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password; // будем хранить хеш

    @Column(nullable = false, length = 20)
    private String role; // например: "LIBRARIAN", "ADMIN"

    @Column(nullable = false)
    private Boolean enabled = true;
}