package com.library.controller;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ReportController {

    @Autowired
    private BookRepository bookRepository;

    // Отчет 1: Полный список книг (TXT)
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
            // ИСПРАВЛЕНИЕ: используем bookType вместо typeId
            report.append("Тип: ").append(book.getBookType() != null ? book.getBookType().getType() : "Не указан").append("\n");
            report.append("--------------------------\n");
        }

        report.append("\nВсего книг: ").append(books.size());
        return report.toString();
    }

    // Отчет 2: Статистика по типам книг (TXT)
    @GetMapping("/books-statistics")
    public String generateStatisticsReport() {
        List<Book> books = bookRepository.findAll();

        // Группировка по bookType (объекту) вместо typeId
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
}