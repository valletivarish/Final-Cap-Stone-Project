package com.monocept.myapp.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CustomerSideQueryRequestDto {
	private long id;
	@NotEmpty(message = "Title is required")
	@Column(name = "title")
	private String title;

	@NotEmpty(message = "Message is required")
	@Column(name = "message")
	private String message;

	@Column(name = "isResolved")
	private boolean resolved = false;
}
