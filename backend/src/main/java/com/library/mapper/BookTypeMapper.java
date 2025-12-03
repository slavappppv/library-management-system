package com.library.mapper;

import com.library.dto.BookTypeDTO;
import com.library.model.BookType;
import org.springframework.stereotype.Component;

@Component
public class BookTypeMapper {

    public BookTypeDTO toDTO(BookType bookType) {
        if (bookType == null) return null;

        BookTypeDTO dto = new BookTypeDTO();
        dto.setId(bookType.getId());
        dto.setType(bookType.getType());
        dto.setFine(bookType.getFine());
        dto.setDayCount(bookType.getDayCount());

        return dto;
    }

    public BookType toEntity(BookTypeDTO dto) {
        if (dto == null) return null;

        BookType bookType = new BookType();
        bookType.setId(dto.getId());
        bookType.setType(dto.getType());
        bookType.setFine(dto.getFine());
        bookType.setDayCount(dto.getDayCount());

        return bookType;
    }
}