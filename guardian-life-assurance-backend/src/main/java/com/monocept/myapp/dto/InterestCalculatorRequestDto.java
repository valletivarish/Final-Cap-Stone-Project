package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class InterestCalculatorRequestDto {
	private long schemeId;
	private int years;
	private double investAmount;
	private int months;
	
	
}
