package com.library.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ClientStatsDTO {
    @JsonProperty("clientId")
    private Integer clientId;

    @JsonProperty("activeBooksCount")
    private Integer activeBooksCount;

    @JsonProperty("totalFine")
    private BigDecimal totalFine;

    public ClientStatsDTO() {}

    public ClientStatsDTO(Integer clientId, Integer activeBooksCount, BigDecimal totalFine) {
        this.clientId = clientId;
        this.activeBooksCount = activeBooksCount;
        this.totalFine = totalFine;
    }
}