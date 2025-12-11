package com.library.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.library.exception.ErrorCode;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ErrorResponse {
    private ErrorCode errorCode;
    private String message;
    private String userMessage;
    private String details;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private Map<String, String> validationErrors;

    public ErrorResponse(ErrorCode errorCode, String message, String userMessage) {
        this.errorCode = errorCode;
        this.message = message;
        this.userMessage = userMessage;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(ErrorCode errorCode, String userMessage) {
        this(errorCode, userMessage, userMessage);
    }

    public ErrorResponse(ErrorCode errorCode, String message, String userMessage, Map<String, String> validationErrors) {
        this(errorCode, message, userMessage);
        this.validationErrors = validationErrors;
    }
}