package com.library.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JournalDTO {
    private Integer id;
    private BookDTO book;
    private ClientDTO client;
    private LocalDate dateBeg;
    private LocalDate dateEnd;
    private LocalDate dateRet;
}