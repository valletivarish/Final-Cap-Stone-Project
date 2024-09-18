package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class InterestCalculatorResponseDto {
	private long noOfInstallments;
	private double installmentAmount;
	private double interestAmount;
	private double assuredAmount;
}
