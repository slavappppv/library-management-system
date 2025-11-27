package com.library.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clients")
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 20)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 20)
    private String lastName;

    @Column(name = "father_name", length = 20)
    private String fatherName;

    @Column(name = "passport_seria", nullable = false, length = 4)
    private String passportSeria;

    @Column(name = "passport_number", nullable = false, length = 6)
    private String passportNumber;
}