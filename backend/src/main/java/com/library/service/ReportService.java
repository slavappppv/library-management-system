package com.library.service;

import com.library.dto.PopularBookDTO;
import com.library.dto.ClientStatsDTO;
import com.library.mapper.ReportMapper;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ReportMapper reportMapper;

    public Integer getClientActiveBooksCount(Integer clientId) {
        Query query = entityManager.createNativeQuery("SELECT public.get_client_active_books_count(:clientId)")
                .setParameter("clientId", clientId);
        Object result = query.getSingleResult();
        return result != null ? ((Number) result).intValue() : 0;
    }

    public BigDecimal getClientTotalFine(Integer clientId) {
        Query query = entityManager.createNativeQuery("SELECT public.get_client_total_fine(:clientId)")
                .setParameter("clientId", clientId);
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    public ClientStatsDTO getClientStats(Integer clientId) {
        Integer activeBooks = getClientActiveBooksCount(clientId);
        BigDecimal totalFine = getClientTotalFine(clientId);

        return reportMapper.toClientStatsDTO(clientId, activeBooks, totalFine);
    }

    public BigDecimal getMaxSingleFine() {
        // Функция без параметров, возвращает scalar
        Query query = entityManager.createNativeQuery("SELECT public.get_max_single_fine()");
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    public List<PopularBookDTO> getTopPopularBooks(Integer limit) {
        Query query = entityManager.createNativeQuery(
                        "SELECT * FROM public.get_top_popular_books(:limit)")
                .setParameter("limit", limit != null ? limit : 3);

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(reportMapper::toPopularBookDTO)
                .collect(Collectors.toList());
    }
}