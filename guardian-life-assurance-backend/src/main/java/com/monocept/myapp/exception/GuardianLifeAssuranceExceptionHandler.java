package com.monocept.myapp.exception;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GuardianLifeAssuranceExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(GuardianLifeAssuranceExceptionHandler.class);

	@ExceptionHandler
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleException(GuardianLifeAssuranceApiException exc) {
		logger.error("Handling GuardianLifeAssuranceApiException: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setMessage(exc.getMessage());
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleException(AccessDeniedException exc) {
		logger.error("Handling AccessDeniedException: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.UNAUTHORIZED.value());
		error.setMessage("Access Denied: " + exc.getMessage());
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(GuardianLifeAssuranceException.ResourceNotFoundException.class)
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleException(
			GuardianLifeAssuranceException.ResourceNotFoundException exc) {
		logger.error("Handling ResourceNotFoundException: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.NOT_FOUND.value());
		error.setMessage(exc.getMessage());
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(GuardianLifeAssuranceException.UserNotFoundException.class)
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleException(
			GuardianLifeAssuranceException.UserNotFoundException exc) {
		logger.error("Handling UserNotFoundException: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.NOT_FOUND.value());
		error.setMessage(exc.getMessage());
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleBadCredentialsException(
			BadCredentialsException exc) {
		logger.error("Handling BadCredentialsException: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.UNAUTHORIZED.value());
		error.setMessage("Invalid username or password. Please check your credentials and try again.");
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	private ResponseEntity<GuardianLifeAssuranceErrorResponse> buildErrorResponse(Exception exc, HttpStatus status) {
		return buildErrorResponse(exc, status, exc.getMessage());
	}

	private ResponseEntity<GuardianLifeAssuranceErrorResponse> buildErrorResponse(Exception exc, HttpStatus status,
			String message) {
		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(status.value());
		error.setMessage(message);
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, status);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
		logger.error("Handling MethodArgumentNotValidException: {}", ex.getMessage());
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleGenericException(IllegalArgumentException exc) {

		logger.error("Handling IllegalArgumentException: {}", exc.getMessage());

		return buildErrorResponse(exc, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler
	public ResponseEntity<GuardianLifeAssuranceErrorResponse> handleException(Exception exc) {
		logger.error("Handling generic exception: {}", exc.getMessage());

		GuardianLifeAssuranceErrorResponse error = new GuardianLifeAssuranceErrorResponse();
		error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.setMessage("Internal Server Error: " + exc.getMessage());
		error.setTimeStamp(System.currentTimeMillis());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
