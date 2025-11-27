package com.library.controller;

import com.library.model.Journal;
import com.library.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @GetMapping
    public List<Journal> getAllJournalRecords() {
        return journalService.getAllJournalRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Journal> getJournalRecordById(@PathVariable Integer id) {
        Optional<Journal> journal = journalService.getJournalRecordById(id);
        return journal.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Journal createJournalRecord(@RequestBody Journal journal) {
        return journalService.saveJournalRecord(journal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Journal> updateJournalRecord(@PathVariable Integer id, @RequestBody Journal journal) {
        if (!journalService.journalRecordExists(id)) {
            return ResponseEntity.notFound().build();
        }
        journal.setId(id);
        return ResponseEntity.ok(journalService.saveJournalRecord(journal));
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