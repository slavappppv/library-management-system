package com.library.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PopularBookDTO {
    @JsonProperty("id")
    private Integer bookId;

    @JsonProperty("name")
    private String bookName;

    @JsonProperty("borrowCount")
    private Long borrowCount;

    public PopularBookDTO() {}

    public PopularBookDTO(Integer bookId, String bookName, Long borrowCount) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.borrowCount = borrowCount;
    }
}