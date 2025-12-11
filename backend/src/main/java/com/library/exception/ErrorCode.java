package com.library.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // Аутентификация и авторизация
    AUTH_ERROR("Ошибка авторизации"),
    INVALID_CREDENTIALS("Неверный логин или пароль"),
    ACCOUNT_DISABLED("Учетная запись отключена"),
    ACCESS_DENIED("Доступ запрещен"),
    USERNAME_EXISTS("Пользователь с таким логином уже существует"),
    PASSPORT_EXISTS("Клиент с таким паспортом уже существует"),

    // Валидация данных
    VALIDATION_ERROR("Ошибка валидации данных"),
    INVALID_PASSPORT_FORMAT("Неверный формат паспорта"),
    INVALID_DATE("Неверная дата"),

    // Ресурсы не найдены
    NOT_FOUND("Ресурс не найден"),
    BOOK_NOT_FOUND("Книга не найдена"),
    CLIENT_NOT_FOUND("Клиент не найдена"),
    USER_NOT_FOUND("Пользователь не найдена"),
    JOURNAL_NOT_FOUND("Запись журнала не найдена"),
    BOOK_TYPE_NOT_FOUND("Тип книги не найден"),

    // Бизнес-логика
    BUSINESS_RULE("Нарушение бизнес-правила"),
    BOOK_UNAVAILABLE("Книга недоступна"),
    BOOK_ALREADY_TAKEN("Книга уже взята этим читателем"),
    BOOK_ALREADY_RETURNED("Книга уже возвращена"),
    NO_COPIES_AVAILABLE("Нет доступных экземпляров"),

    // Ошибки базы данных
    DATABASE_ERROR("Ошибка базы данных"),
    TRIGGER_ERROR("Ошибка при выполнении операции"),
    CONSTRAINT_ERROR("Нарушение ограничений данных");

    private final String description;

    ErrorCode(String description) {
        this.description = description;
    }
}