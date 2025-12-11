package com.library.exception;

public class AuthException extends AppException {
    public AuthException(String message) {
        super(ErrorCode.AUTH_ERROR, message, message);
    }

    public AuthException(String message, String userMessage) {
        super(ErrorCode.AUTH_ERROR, message, userMessage);
    }
}