package com.library.controller;

import com.library.dto.JournalDTO;
import com.library.mapper.JournalMapper;
import com.library.model.Journal;
import com.library.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public JournalDTO createJournalRecord(@RequestBody JournalDTO journalDTO) {
        // Создание через ReaderController.takeBook()
        throw new UnsupportedOperationException("Используйте /api/reader/take-book для взятия книги");
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