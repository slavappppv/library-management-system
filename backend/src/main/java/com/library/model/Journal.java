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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name = "date_beg", nullable = false)
    private LocalDate dateBeg;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Column(name = "date_ret")
    private LocalDate dateRet;
}