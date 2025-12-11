package com.library.service;

import com.library.exception.BusinessException;
import com.library.exception.NotFoundException;
import com.library.model.Journal;
import com.library.model.Book;
import com.library.model.Client;
import com.library.repository.JournalRepository;
import com.library.repository.BookRepository;
import com.library.repository.ClientRepository;
import jakarta.transaction.Transactional;
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

    @Transactional
    public Journal takeBook(Integer bookId, Integer clientId) {
        if (journalRepository.existsByBookIdAndClientIdAndDateRetIsNull(bookId, clientId)) {
            throw new BusinessException("Клиент уже взял эту книгу", "Вы уже взяли эту книгу. Сначала верните её.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Книга не найдена", "Книга не найдена"));

        if (book.getCount() <= 0) {
            throw new BusinessException("Книга недоступна (нет свободных экземпляров)", "Извините, все экземпляры этой книги выданы.");
        }

        Client client = clientRepository.getReferenceById(clientId);

        Journal journal = new Journal();
        journal.setBook(book);
        journal.setClient(client);
        journal.setDateBeg(LocalDate.now());
        journal.setDateEnd(LocalDate.now().plusDays(book.getBookType().getDayCount()));

        return journalRepository.save(journal);
    }

    @Transactional
    public Journal returnBook(Integer journalId) {
        Journal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new NotFoundException("Запись журнала не найдена", "Запись о выдаче книги не найдена"));

        if (journal.getDateRet() != null) {
            throw new BusinessException("Книга уже возвращена", "Эта книга уже была возвращена ранее.");
        }

        journal.setDateRet(LocalDate.now());
        return journalRepository.save(journal);
    }
}