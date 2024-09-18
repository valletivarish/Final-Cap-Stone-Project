package com.monocept.myapp.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class QueryResponseDto {
	private long queryId;
	private long customerId;
	private String customerName;
	private String resolvedBy;
	private LocalDate resolvedAt;
	private String title;
	private String message;
	private String response;
	private boolean resolved;
}
