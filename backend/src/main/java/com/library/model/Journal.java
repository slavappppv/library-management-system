package com.library.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "journal")
@Data
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "book_id", nullable = false)
    private Integer bookId;

    @Column(name = "client_id", nullable = false)
    private Integer clientId;

    @Column(name = "date_beg", nullable = false)
    private LocalDate dateBeg;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Column(name = "date_ret")
    private LocalDate dateRet;
}