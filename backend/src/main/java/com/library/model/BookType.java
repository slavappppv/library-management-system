package com.library.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "book_types")
@Data
public class BookType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type", nullable = false, length = 20)
    private String type;

    @Column(name = "fine", nullable = false)
    private Integer fine;

    @Column(name = "day_count", nullable = false)
    private Integer dayCount;
}