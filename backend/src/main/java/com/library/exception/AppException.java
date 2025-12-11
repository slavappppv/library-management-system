package com.library.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String userMessage;

    public AppException(ErrorCode errorCode, String message, String userMessage) {
        super(message);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
    }

    public AppException(ErrorCode errorCode, String userMessage) {
        this(errorCode, userMessage, userMessage);
    }
}