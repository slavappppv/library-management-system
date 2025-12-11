package com.library.service;

import com.library.dto.FineDTO;
import com.library.model.Journal;
import com.library.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class FineService {

    @Autowired
    private JournalRepository journalRepository;

    // Расчет штрафа для одной записи журнала
    public BigDecimal calculateFineForJournal(Journal journal) {
        if (journal.getDateRet() == null || journal.getDateEnd() == null) {
            return BigDecimal.ZERO;
        }

        // Если вернули вовремя - нет штрафа
        if (!journal.getDateRet().isAfter(journal.getDateEnd())) {
            return BigDecimal.ZERO;
        }

        // Дни просрочки
        long daysLate = ChronoUnit.DAYS.between(journal.getDateEnd(), journal.getDateRet());
        if (daysLate <= 0) {
            return BigDecimal.ZERO;
        }

        // Штраф = дни × штраф за день из типа книги
        BigDecimal finePerDay = BigDecimal.valueOf(journal.getBook().getBookType().getFine());
        return finePerDay.multiply(BigDecimal.valueOf(daysLate));
    }

    // Получить все штрафы клиента
    public List<FineDTO> getClientFines(Integer clientId) {
        List<Journal> clientJournals = journalRepository.findByClientIdAndDateRetIsNotNull(clientId);
        List<FineDTO> fines = new ArrayList<>();

        for (Journal journal : clientJournals) {
            BigDecimal fineAmount = calculateFineForJournal(journal);
            if (fineAmount.compareTo(BigDecimal.ZERO) > 0) {
                FineDTO dto = new FineDTO();
                dto.setJournalId(journal.getId());
                dto.setBookName(journal.getBook().getName());
                dto.setDueDate(journal.getDateEnd());
                dto.setReturnDate(journal.getDateRet());

                long daysLate = ChronoUnit.DAYS.between(journal.getDateEnd(), journal.getDateRet());
                dto.setDaysLate((int) daysLate);
                dto.setAmount(fineAmount);

                fines.add(dto);
            }
        }

        return fines;
    }

    // Получить общую сумму штрафов клиента
    public BigDecimal getClientTotalFine(Integer clientId) {
        List<FineDTO> fines = getClientFines(clientId);
        return fines.stream()
                .map(FineDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<FineDTO> getAllClientFines(Integer clientId) {
        List<Journal> allClientJournals = journalRepository.findByClientId(clientId);
        List<FineDTO> fines = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Journal journal : allClientJournals) {
            BigDecimal fineAmount = BigDecimal.ZERO;
            Integer daysLate = 0;
            LocalDate dueDate = journal.getDateEnd();

            if (journal.getDateRet() != null) {
                // Для возвращенных книг: штраф за фактическую просрочку
                if (journal.getDateRet().isAfter(journal.getDateEnd())) {
                    daysLate = (int) ChronoUnit.DAYS.between(journal.getDateEnd(), journal.getDateRet());
                    fineAmount = calculateActualFine(journal, daysLate);
                }
            } else {
                // Для НЕ возвращенных книг: штраф за текущую просрочку (если есть)
                if (today.isAfter(journal.getDateEnd())) {
                    daysLate = (int) ChronoUnit.DAYS.between(journal.getDateEnd(), today);
                    fineAmount = calculateCurrentFine(journal, daysLate);
                }
            }

            if (fineAmount.compareTo(BigDecimal.ZERO) > 0) {
                FineDTO dto = new FineDTO();
                dto.setJournalId(journal.getId());
                dto.setBookName(journal.getBook().getName());
                dto.setDueDate(dueDate);
                dto.setReturnDate(journal.getDateRet());
                dto.setDaysLate(daysLate);
                dto.setAmount(fineAmount);

                fines.add(dto);
            }
        }

        return fines;
    }

    private BigDecimal calculateActualFine(Journal journal, long daysLate) {
        BigDecimal finePerDay = BigDecimal.valueOf(journal.getBook().getBookType().getFine());
        return finePerDay.multiply(BigDecimal.valueOf(daysLate));
    }

    private BigDecimal calculateCurrentFine(Journal journal, long daysLate) {
        BigDecimal finePerDay = BigDecimal.valueOf(journal.getBook().getBookType().getFine());
        return finePerDay.multiply(BigDecimal.valueOf(daysLate));
    }
}