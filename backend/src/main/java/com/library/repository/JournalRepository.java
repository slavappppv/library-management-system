package com.library.repository;

import com.library.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Integer> {

    List<Journal> findByClientIdAndDateRetIsNull(Integer clientId);

    List<Journal> findByClientIdAndDateRetIsNotNull(Integer clientId);

    boolean existsByBookIdAndClientIdAndDateRetIsNull(Integer bookId, Integer clientId);
}