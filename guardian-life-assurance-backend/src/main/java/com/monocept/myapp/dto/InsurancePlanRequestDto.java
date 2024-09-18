package com.monocept.myapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class InsurancePlanRequestDto {
	
    private Long planId;

    @NotEmpty(message = "Plan name is required")
    private String planName;

    private boolean isActive = true;
}
