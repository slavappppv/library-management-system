package com.library.controller;

import com.library.dto.JournalDTO;
import com.library.model.Book;
import com.library.model.Journal;
import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.service.BookService;
import com.library.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.library.config.JwtUtil;
import com.library.mapper.JournalMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reader")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ReaderController {

    @Autowired
    private BookService bookService;

    @Autowired
    private JournalService journalService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JournalMapper journalMapper;

    @GetMapping("/available-books")
    public List<Book> getAvailableBooks(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ROLE_READER".equals(user.getRole())) {
            throw new RuntimeException("Access denied. Reader functionality only.");
        }

        return bookService.findAvailableBooksForClient(user.getClient().getId());
    }

    @GetMapping("/current-books")
    public List<JournalDTO> getCurrentBooks(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Journal> journals = journalService.getCurrentBooksByClient(user.getClient().getId());
        return journals.stream()
                .map(journalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/book-history")
    public List<Journal> getBookHistory(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return journalService.getBookHistoryByClient(user.getClient().getId());
    }

    @PostMapping("/take-book")
    public ResponseEntity<?> takeBook(@RequestBody TakeBookRequest request,
                                      @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Journal journal = journalService.takeBook(request.getBookId(), user.getClient().getId());
            return ResponseEntity.ok(journal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class TakeBookRequest {
        private Integer bookId;

        public Integer getBookId() { return bookId; }
        public void setBookId(Integer bookId) { this.bookId = bookId; }
    }
}