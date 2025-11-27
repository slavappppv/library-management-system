package com.library.controller;

import com.library.model.BookType;
import com.library.service.BookTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/book-types")
public class BookTypeController {

    @Autowired
    private BookTypeService bookTypeService;

    @GetMapping
    public List<BookType> getAllBookTypes() {
        return bookTypeService.getAllBookTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookType> getBookTypeById(@PathVariable Integer id) {
        Optional<BookType> bookType = bookTypeService.getBookTypeById(id);
        return bookType.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BookType createBookType(@RequestBody BookType bookType) {
        return bookTypeService.saveBookType(bookType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookType> updateBookType(@PathVariable Integer id, @RequestBody BookType bookType) {
        if (!bookTypeService.bookTypeExists(id)) {
            return ResponseEntity.notFound().build();
        }
        bookType.setId(id);
        return ResponseEntity.ok(bookTypeService.saveBookType(bookType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookType(@PathVariable Integer id) {
        if (!bookTypeService.bookTypeExists(id)) {
            return ResponseEntity.notFound().build();
        }
        bookTypeService.deleteBookType(id);
        return ResponseEntity.ok().build();
    }
}