package com.library.controller;

import com.library.dto.PopularBookDTO;
import com.library.dto.ClientStatsDTO;
import com.library.model.Book;
import com.library.model.BookType;
import com.library.repository.BookRepository;
import com.library.repository.BookTypeRepository;
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

    @Autowired
    private BookTypeRepository bookTypeRepository;

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
        List<BookType> allBookTypes = bookTypeRepository.findAll();

        Map<String, Integer> typeCounts = new HashMap<>();
        Map<String, Integer> typeTotal = new HashMap<>();

        for (BookType bookType : allBookTypes) {
            typeCounts.put(bookType.getType(), 0);
            typeTotal.put(bookType.getType(), 0);
        }

        for (Book book : books) {
            if (book.getBookType() != null) {
                String typeName = book.getBookType().getType();
                typeCounts.put(typeName, typeCounts.getOrDefault(typeName, 0) + 1);
                typeTotal.put(typeName, typeTotal.getOrDefault(typeName, 0) + book.getCount());
            }
        }

        StringBuilder report = new StringBuilder();
        report.append("СТАТИСТИКА ПО ТИПАМ КНИГ\n");
        report.append("=========================\n\n");

        // Выводим ВСЕ типы
        for (BookType bookType : allBookTypes) {
            String typeName = bookType.getType();
            int bookCount = typeCounts.get(typeName);
            int totalCount = typeTotal.get(typeName);

            report.append("Тип: ").append(typeName).append("\n");
            report.append("Количество наименований: ").append(bookCount).append("\n");
            report.append("Общее количество экземпляров: ").append(totalCount).append("\n");
            report.append("--------------------------\n");
        }

        // Добавим также книги без типа
        int booksWithoutType = 0;
        int totalWithoutType = 0;
        for (Book book : books) {
            if (book.getBookType() == null) {
                booksWithoutType++;
                totalWithoutType += book.getCount();
            }
        }

        if (booksWithoutType > 0) {
            report.append("Тип: Не указан\n");
            report.append("Количество наименований: ").append(booksWithoutType).append("\n");
            report.append("Общее количество экземпляров: ").append(totalWithoutType).append("\n");
            report.append("--------------------------\n");
        }

        report.append("\nВсего типов: ").append(allBookTypes.size());
        report.append("\nВсего книг: ").append(books.size());
        report.append("\nВсего экземпляров: ").append(books.stream().mapToInt(Book::getCount).sum());

        return report.toString();
    }

    @GetMapping("/client/{clientId}/active-books-count")
    public ResponseEntity<Integer> getClientActiveBooksCount(@PathVariable Integer clientId) {
        Integer count = reportService.getClientActiveBooksCount(clientId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/client/{clientId}/total-fine")
    public ResponseEntity<BigDecimal> getClientTotalFine(@PathVariable Integer clientId) {
        BigDecimal fine = reportService.getClientTotalFine(clientId);
        return ResponseEntity.ok(fine);
    }

    @GetMapping("/client/{clientId}/stats")
    public ResponseEntity<ClientStatsDTO> getClientStats(@PathVariable Integer clientId) {
        ClientStatsDTO stats = reportService.getClientStats(clientId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/max-single-fine")
    public ResponseEntity<BigDecimal> getMaxSingleFine() {
        BigDecimal maxFine = reportService.getMaxSingleFine();
        return ResponseEntity.ok(maxFine);
    }

    @GetMapping("/popular-books")
    public ResponseEntity<List<PopularBookDTO>> getTopPopularBooks(
            @RequestParam(required = false, defaultValue = "3") Integer limit) {
        List<PopularBookDTO> popularBooks = reportService.getTopPopularBooks(limit);
        return ResponseEntity.ok(popularBooks);
    }
}