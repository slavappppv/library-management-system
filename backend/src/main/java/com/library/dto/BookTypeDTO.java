package com.library.dto;

import lombok.Data;

@Data
public class BookTypeDTO {
    private Integer id;
    private String type;
    private Integer fine;
    private Integer dayCount;
}