package com.library.dto;

import lombok.Data;

@Data
public class BookDTO {
    private Integer id;
    private String name;
    private Integer count;
    private BookTypeDTO bookType;
}