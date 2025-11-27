package com.library.repository;

import com.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    // Spring Data JPA автоматически создаст методы:
    // findAll(), findById(), save(), delete(), count()
}