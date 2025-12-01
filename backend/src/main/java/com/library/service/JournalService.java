package com.library.service;

import com.library.model.Journal;
import com.library.model.Book;
import com.library.model.Client;
import com.library.repository.JournalRepository;
import com.library.repository.BookRepository;
import com.library.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ClientRepository clientRepository;

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

    public List<Journal> getCurrentBooksByClient(Integer clientId) {
        return journalRepository.findByClientIdAndDateRetIsNull(clientId);
    }

    public List<Journal> getBookHistoryByClient(Integer clientId) {
        return journalRepository.findByClientIdAndDateRetIsNotNull(clientId);
    }

    public Journal takeBook(Integer bookId, Integer clientId) {
        if (journalRepository.existsByBookIdAndClientIdAndDateRetIsNull(bookId, clientId)) {
            throw new RuntimeException("Клиент уже взял эту книгу");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Книга не найдена"));

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Клиент не найдена"));

        if (book.getCount() <= 0) {
            throw new RuntimeException("Книга недоступна");
        }

        Journal journal = new Journal();
        journal.setBook(book);
        journal.setClient(client);
        journal.setDateBeg(LocalDate.now());
        journal.setDateEnd(LocalDate.now().plusDays(book.getBookType().getDayCount()));

        book.setCount(book.getCount() - 1);
        bookRepository.save(book);

        return journalRepository.save(journal);
    }
}