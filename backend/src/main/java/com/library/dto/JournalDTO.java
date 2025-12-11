package com.library.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JournalDTO {
    private Integer id;
    private Integer bookId;
    private Integer clientId;
    private BookDTO book;
    private ClientDTO client;
    private LocalDate dateBeg;
    private LocalDate dateEnd;
    private LocalDate dateRet;
}