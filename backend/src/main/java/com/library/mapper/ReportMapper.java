package com.library.mapper;

import com.library.dto.PopularBookDTO;
import com.library.dto.ClientStatsDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ReportMapper {

    public PopularBookDTO toPopularBookDTO(Object[] row) {
        if (row == null || row.length < 3) return null;

        return new PopularBookDTO(
                (Integer) row[0],
                (String) row[1],
                ((Number) row[2]).longValue()
        );
    }

    public ClientStatsDTO toClientStatsDTO(Integer clientId, Integer activeBooks, BigDecimal totalFine) {
        return new ClientStatsDTO(clientId, activeBooks, totalFine);
    }
}