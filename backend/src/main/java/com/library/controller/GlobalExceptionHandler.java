package com.library.controller;

import com.library.dto.ErrorResponse;
import com.library.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Обработка наших кастомных исключений
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex) {
        log.warn("Auth exception: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getUserMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        log.warn("Validation exception: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getUserMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        log.warn("Not found exception: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getUserMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getUserMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    // Обработка ошибок валидации Spring
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse error = new ErrorResponse(
                ErrorCode.VALIDATION_ERROR,
                "Ошибка валидации полей",
                "Проверьте правильность заполнения полей",
                errors
        );
        log.warn("Validation errors: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // Обработка ошибок базы данных
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseException(DataAccessException ex) {
        log.error("Database error: {}", ex.getMessage(), ex);

        // Пытаемся извлечь понятное сообщение из ошибки БД
        String userMessage = extractUserFriendlyMessage(ex);

        ErrorResponse error = new ErrorResponse(
                ErrorCode.DATABASE_ERROR,
                ex.getMessage(),
                userMessage
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // Обработка ошибок доступа
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                ErrorCode.ACCESS_DENIED,
                ex.getMessage(),
                "У вас нет прав для выполнения этой операции"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // Обработка всех остальных исключений
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                ErrorCode.BUSINESS_RULE,
                ex.getMessage(),
                "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private String extractUserFriendlyMessage(DataAccessException ex) {
        Throwable cause = ex.getMostSpecificCause();
        String message = cause != null ? cause.getMessage() : ex.getMessage();

        if (message == null) {
            return "Ошибка при работе с базой данных";
        }

        System.out.println("DB Error Message: " + message);

        if (message.contains("У клиента уже 10 книг") ||
                message.contains("10 книг") ||
                message.contains("больше нельзя")) {
            return "Нельзя взять больше книг! У вас уже максимальное количество (10 книг)";
        }

        if (message.contains("no_delete_unreturned()")) {
            return "Нельзя удалить запись: книга еще не возвращена";
        }

        // Ищем русские слова в любом виде
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("unreturned") ||
                lowerMessage.contains("удалить") ||
                message.contains("нельзя") ||
                message.contains("не возвращена")) {
            return "Нельзя удалить запись: книга еще не возвращена";
        }

        if (lowerMessage.contains("книги закончились") ||
                lowerMessage.contains("нет свободных")) {
            return "Книги закончились! Все экземпляры уже выданы.";
        }

        if (lowerMessage.contains("duplicate key") ||
                lowerMessage.contains("уже существует")) {
            return "Запись с такими данными уже существует";
        }

        return "Ошибка при выполнении операции. Проверьте введенные данные.";
    }
}