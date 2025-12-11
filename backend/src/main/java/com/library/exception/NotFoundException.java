package com.library.exception;

public class NotFoundException extends AppException {
    public NotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message, "Не найдено: " + message);
    }

    public NotFoundException(String message, String userMessage) {
        super(ErrorCode.NOT_FOUND, message, userMessage);
    }
}