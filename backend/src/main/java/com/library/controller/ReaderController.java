package com.library.controller;

import com.library.dto.FineDTO;
import com.library.dto.JournalDTO;
import com.library.exception.AuthException;
import com.library.exception.NotFoundException;
import com.library.model.Book;
import com.library.model.Journal;
import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.service.BookService;
import com.library.service.FineService;
import com.library.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.library.config.JwtUtil;
import com.library.mapper.JournalMapper;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private FineService fineService;

    @GetMapping("/available-books")
    public List<Book> getAvailableBooks(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", "Пользователь не найден"));

        if (!"ROLE_READER".equals(user.getRole())) {
            throw new AuthException("Access denied", "Доступ запрещен. Только для читателей.");
        }

        return bookService.findAvailableBooksForClient(user.getClient().getId());
    }

    @GetMapping("/my-fines")
    public ResponseEntity<?> getMyFines(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FineDTO> fines = fineService.getClientFines(user.getClient().getId());
        BigDecimal total = fineService.getClientTotalFine(user.getClient().getId());

        Map<String, Object> response = new HashMap<>();
        response.put("fines", fines);
        response.put("total", total);

        return ResponseEntity.ok(response);
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
    public List<JournalDTO> getBookHistory(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Journal> history = journalService.getBookHistoryByClient(user.getClient().getId());

        return history.stream()
                .map(journalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/take-book")
    public ResponseEntity<?> takeBook(@RequestBody TakeBookRequest request,
                                      @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Journal journal = journalService.takeBook(request.getBookId(), user.getClient().getId());
        return ResponseEntity.ok(journal);
    }

    public static class TakeBookRequest {
        private Integer bookId;

        public Integer getBookId() { return bookId; }
        public void setBookId(Integer bookId) { this.bookId = bookId; }
    }

    @PostMapping("/return-book")
    public ResponseEntity<?> returnBook(@RequestBody ReturnBookRequest request,
                                        @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Journal journal = journalService.getJournalRecordById(request.getJournalId())
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        if (!journal.getClient().getId().equals(user.getClient().getId())) {
            return ResponseEntity.status(403).body("Эта книга не ваша");
        }
        Journal returnedJournal = journalService.returnBook(request.getJournalId());
        return ResponseEntity.ok(journalMapper.toDTO(returnedJournal));
    }

    public static class ReturnBookRequest {
        private Integer journalId;

        public Integer getJournalId() { return journalId; }
        public void setJournalId(Integer journalId) { this.journalId = journalId; }
    }
}