package com.library.service;

import com.library.model.Book;
import com.library.model.Journal;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private JournalService journalService;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }

    public boolean bookExists(Integer id) {
        return bookRepository.existsById(id);
    }

    public List<Book> findAvailableBooksForClient(Integer clientId) {
        List<Book> allAvailableBooks = bookRepository.findByCountGreaterThan(0);
        List<Journal> clientCurrentBooks = journalService.getCurrentBooksByClient(clientId);
        Set<Integer> clientBookIds = clientCurrentBooks.stream()
                .map(j -> j.getBook().getId())
                .collect(Collectors.toSet());

        return allAvailableBooks.stream()
                .filter(book -> !clientBookIds.contains(book.getId()))
                .collect(Collectors.toList());
    }
}