package com.library.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FineDTO {
    private Integer journalId;
    private String bookName;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Integer daysLate;
    private BigDecimal amount;

    public FineDTO() {}

    public FineDTO(Integer journalId, String bookName, LocalDate dueDate,
                   LocalDate returnDate, Integer daysLate, BigDecimal amount) {
        this.journalId = journalId;
        this.bookName = bookName;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.daysLate = daysLate;
        this.amount = amount;
    }
}