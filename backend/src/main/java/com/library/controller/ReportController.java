package com.library.controller;

import com.library.dto.PopularBookDTO;
import com.library.dto.ClientStatsDTO;
import com.library.model.Book;
import com.library.repository.BookRepository;
import com.library.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ReportController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReportService reportService;

    // === СУЩЕСТВУЮЩИЕ ОТЧЕТЫ ===

    @GetMapping("/books-full")
    public String generateBooksReport() {
        List<Book> books = bookRepository.findAll();

        StringBuilder report = new StringBuilder();
        report.append("ОТЧЕТ ПО КНИГАМ БИБЛИОТЕКИ\n");
        report.append("==========================\n\n");

        for (Book book : books) {
            report.append("ID: ").append(book.getId()).append("\n");
            report.append("Название: ").append(book.getName()).append("\n");
            report.append("Количество: ").append(book.getCount()).append("\n");
            report.append("Тип: ").append(book.getBookType() != null ? book.getBookType().getType() : "Не указан").append("\n");
            report.append("--------------------------\n");
        }

        report.append("\nВсего книг: ").append(books.size());
        return report.toString();
    }

    @GetMapping("/books-statistics")
    public String generateStatisticsReport() {
        List<Book> books = bookRepository.findAll();

        Map<String, Integer> typeCounts = new HashMap<>();
        Map<String, Integer> typeTotal = new HashMap<>();

        for (Book book : books) {
            String typeName = book.getBookType() != null ? book.getBookType().getType() : "Не указан";
            typeCounts.put(typeName, typeCounts.getOrDefault(typeName, 0) + 1);
            typeTotal.put(typeName, typeTotal.getOrDefault(typeName, 0) + book.getCount());
        }

        StringBuilder report = new StringBuilder();
        report.append("СТАТИСТИКА ПО ТИПАМ КНИГ\n");
        report.append("=========================\n\n");

        for (Map.Entry<String, Integer> entry : typeCounts.entrySet()) {
            String typeName = entry.getKey();
            int bookCount = entry.getValue();
            int totalCount = typeTotal.get(typeName);

            report.append("Тип: ").append(typeName).append("\n");
            report.append("Количество наименований: ").append(bookCount).append("\n");
            report.append("Общее количество экземпляров: ").append(totalCount).append("\n");
            report.append("--------------------------\n");
        }

        report.append("\nВсего типов: ").append(typeCounts.size());
        return report.toString();
    }

    // === НОВАЯ СТАТИСТИКА (хранимые процедуры) ===

    @GetMapping("/client/{clientId}/active-books-count")
    public ResponseEntity<Integer> getClientActiveBooksCount(@PathVariable Integer clientId) {
        try {
            Integer count = reportService.getClientActiveBooksCount(clientId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/client/{clientId}/total-fine")
    public ResponseEntity<BigDecimal> getClientTotalFine(@PathVariable Integer clientId) {
        try {
            BigDecimal fine = reportService.getClientTotalFine(clientId);
            return ResponseEntity.ok(fine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/client/{clientId}/stats")
    public ResponseEntity<ClientStatsDTO> getClientStats(@PathVariable Integer clientId) {
        try {
            ClientStatsDTO stats = reportService.getClientStats(clientId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/max-single-fine")
    public ResponseEntity<BigDecimal> getMaxSingleFine() {
        try {
            BigDecimal maxFine = reportService.getMaxSingleFine();
            return ResponseEntity.ok(maxFine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/popular-books")
    public ResponseEntity<List<PopularBookDTO>> getTopPopularBooks(
            @RequestParam(required = false, defaultValue = "3") Integer limit) {
        try {
            List<PopularBookDTO> popularBooks = reportService.getTopPopularBooks(limit);
            return ResponseEntity.ok(popularBooks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}