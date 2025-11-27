package com.library.service;

import com.library.model.BookType;
import com.library.repository.BookTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookTypeService {

    @Autowired
    private BookTypeRepository bookTypeRepository;

    public List<BookType> getAllBookTypes() {
        return bookTypeRepository.findAll();
    }

    public Optional<BookType> getBookTypeById(Integer id) {
        return bookTypeRepository.findById(id);
    }

    public BookType saveBookType(BookType bookType) {
        return bookTypeRepository.save(bookType);
    }

    public void deleteBookType(Integer id) {
        bookTypeRepository.deleteById(id);
    }

    public boolean bookTypeExists(Integer id) {
        return bookTypeRepository.existsById(id);
    }
}