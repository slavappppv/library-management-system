package com.library.mapper;

import com.library.dto.JournalDTO;
import com.library.model.Journal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JournalMapper {

    @Autowired
    private BookMapper bookMapper;

    @Autowired
    private ClientMapper clientMapper;

    public JournalDTO toDTO(Journal journal) {
        if (journal == null) return null;

        JournalDTO dto = new JournalDTO();
        dto.setId(journal.getId());
        dto.setBook(bookMapper.toDTO(journal.getBook()));
        dto.setClient(clientMapper.toDTO(journal.getClient()));
        dto.setDateBeg(journal.getDateBeg());
        dto.setDateEnd(journal.getDateEnd());
        dto.setDateRet(journal.getDateRet());

        return dto;
    }

}