package com.library.mapper;

import com.library.dto.*;
import com.library.model.*;
import org.springframework.stereotype.Component;

@Component
public class JournalMapper {

    public JournalDTO toDTO(Journal journal) {
        if (journal == null) return null;

        JournalDTO dto = new JournalDTO();
        dto.setId(journal.getId());
        dto.setBook(toBookDTO(journal.getBook()));
        dto.setClient(toClientDTO(journal.getClient()));
        dto.setDateBeg(journal.getDateBeg());
        dto.setDateEnd(journal.getDateEnd());
        dto.setDateRet(journal.getDateRet());

        return dto;
    }

    private BookDTO toBookDTO(Book book) {
        if (book == null) return null;

        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setName(book.getName());
        dto.setCount(book.getCount());
        dto.setBookType(toBookTypeDTO(book.getBookType()));

        return dto;
    }

    private BookTypeDTO toBookTypeDTO(BookType bookType) {
        if (bookType == null) return null;

        BookTypeDTO dto = new BookTypeDTO();
        dto.setId(bookType.getId());
        dto.setType(bookType.getType());
        dto.setFine(bookType.getFine());
        dto.setDayCount(bookType.getDayCount());

        return dto;
    }

    private ClientDTO toClientDTO(Client client) {
        if (client == null) return null;

        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFirstName(client.getFirstName());
        dto.setLastName(client.getLastName());
        dto.setFatherName(client.getFatherName());

        return dto;
    }
}