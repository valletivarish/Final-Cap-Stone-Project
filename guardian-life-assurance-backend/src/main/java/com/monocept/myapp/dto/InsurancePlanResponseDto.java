package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class InsurancePlanResponseDto {
	 private Long planId;
	    
	    private String planName;

	    private boolean isActive;
}
