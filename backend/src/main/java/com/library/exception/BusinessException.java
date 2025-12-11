package com.library.exception;

public class BusinessException extends AppException {
    public BusinessException(String message) {
        super(ErrorCode.BUSINESS_RULE, message, message);
    }

    public BusinessException(String message, String userMessage) {
        super(ErrorCode.BUSINESS_RULE, message, userMessage);
    }
}