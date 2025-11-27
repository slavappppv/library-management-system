package com.library.service;

import com.library.model.Journal;
import com.library.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    public List<Journal> getAllJournalRecords() {
        return journalRepository.findAll();
    }

    public Optional<Journal> getJournalRecordById(Integer id) {
        return journalRepository.findById(id);
    }

    public Journal saveJournalRecord(Journal journal) {
        return journalRepository.save(journal);
    }

    public void deleteJournalRecord(Integer id) {
        journalRepository.deleteById(id);
    }

    public boolean journalRecordExists(Integer id) {
        return journalRepository.existsById(id);
    }
}