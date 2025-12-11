package com.library.controller;

import com.library.dto.JournalDTO;
import com.library.exception.BusinessException;
import com.library.exception.NotFoundException;
import com.library.mapper.JournalMapper;
import com.library.model.Book;
import com.library.model.Client;
import com.library.model.Journal;
import com.library.repository.BookRepository;
import com.library.repository.ClientRepository;
import com.library.repository.JournalRepository;
import com.library.service.BookService;
import com.library.service.JournalService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @Autowired
    private JournalMapper journalMapper;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private JournalRepository journalRepository;

    @GetMapping
    public List<JournalDTO> getAllJournalRecords() {
        List<Journal> journals = journalService.getAllJournalRecords();
        return journals.stream()
                .map(journalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalDTO> getJournalRecordById(@PathVariable Integer id) {
        Optional<Journal> journal = journalService.getJournalRecordById(id);
        return journal.map(j -> ResponseEntity.ok(journalMapper.toDTO(j)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createJournalRecord(@RequestBody JournalDTO journalDTO) {
        Book book = bookRepository.findById(journalDTO.getBookId())
                .orElseThrow(() -> new NotFoundException("Книга не найдена", "Книга не найдена"));
        if (book.getCount() <= 0) {
            throw new BusinessException("Книга недоступна", "Книга недоступна (нет свободных экземпляров)");
        }

        Client client = clientRepository.findById(journalDTO.getClientId())
                .orElseThrow(() -> new NotFoundException("Клиент не найден", "Клиент не найден"));

        Journal journal = new Journal();
        journal.setBook(book);
        journal.setClient(client);
        journal.setDateBeg(journalDTO.getDateBeg());
        journal.setDateEnd(journalDTO.getDateEnd());

        Journal savedJournal = journalRepository.save(journal);

        return ResponseEntity.ok(journalMapper.toDTO(savedJournal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalDTO> updateJournalRecord(@PathVariable Integer id, @RequestBody JournalDTO journalDTO) {
        if (!journalService.journalRecordExists(id)) {
            return ResponseEntity.notFound().build();
        }

        Journal journal = journalService.getJournalRecordById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        // Можно обновить только дату возврата
        if (journalDTO.getDateRet() != null) {
            journal.setDateRet(journalDTO.getDateRet());
        }

        Journal updatedJournal = journalService.saveJournalRecord(journal);
        return ResponseEntity.ok(journalMapper.toDTO(updatedJournal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournalRecord(@PathVariable Integer id) {
        if (!journalService.journalRecordExists(id)) {
            return ResponseEntity.notFound().build();
        }
        journalService.deleteJournalRecord(id);
        return ResponseEntity.ok().build();
    }
}