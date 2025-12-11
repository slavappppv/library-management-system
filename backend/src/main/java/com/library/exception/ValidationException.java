package com.library.exception;

public class ValidationException extends AppException {
    public ValidationException(String message) {
        super(ErrorCode.VALIDATION_ERROR, message, "Ошибка в данных: " + message);
    }

    public ValidationException(String message, String userMessage) {
        super(ErrorCode.VALIDATION_ERROR, message, userMessage);
    }
}