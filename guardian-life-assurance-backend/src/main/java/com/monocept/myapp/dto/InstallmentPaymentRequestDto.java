package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class InstallmentPaymentRequestDto {
	private long installmentId;
	private String paymentToken;
	private double amount;
	public long customerId;
}
