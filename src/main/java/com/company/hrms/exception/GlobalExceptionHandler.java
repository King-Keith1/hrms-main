package com.company.hrms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Centralized exception handling for all REST controllers
public class GlobalExceptionHandler {

    // --- Handles business logic exceptions ---
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value()); // 400 Bad Request
        error.put("message", ex.getMessage()); // Business error message
        return ResponseEntity.badRequest().body(error);
    }

    // --- Handles validation errors triggered by @Valid ---
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value());
        // Collect all field errors as field: message
        error.put("message", ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .toList());
        return ResponseEntity.badRequest().body(error);
    }

    // --- Handles Spring Security access denied exceptions (403) ---
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.FORBIDDEN.value()); // 403 Forbidden
        error.put("message", "Access denied"); // Generic message for security
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // --- Handles illegal arguments passed to methods ---
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value()); // 400 Bad Request
        error.put("message", ex.getMessage()); // Detailed error from the exception
        return ResponseEntity.badRequest().body(error);
    }
}