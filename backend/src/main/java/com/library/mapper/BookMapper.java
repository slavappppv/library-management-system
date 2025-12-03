package com.library.mapper;

import com.library.dto.BookDTO;
import com.library.dto.BookTypeDTO;
import com.library.model.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    @Autowired
    private BookTypeMapper bookTypeMapper;

    public BookDTO toDTO(Book book) {
        if (book == null) return null;

        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setName(book.getName());
        dto.setCount(book.getCount());

        if (book.getBookType() != null) {
            dto.setBookType(bookTypeMapper.toDTO(book.getBookType()));
        }

        return dto;
    }

    public Book toEntity(BookDTO dto) {
        if (dto == null) return null;

        Book book = new Book();
        book.setId(dto.getId());
        book.setName(dto.getName());
        book.setCount(dto.getCount());

        // BookType устанавливается отдельно через service
        // book.setBookType(bookTypeMapper.toEntity(dto.getBookType()));

        return book;
    }
}