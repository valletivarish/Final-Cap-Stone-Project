package com.monocept.myapp.dto;

import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


@Data
public class InsuranceSettingRequestDto {

    @NotNull(message = "Claim deduction is required.")
    @Min(value = 0, message = "Claim deduction must be a positive number.")
    private double claimDeduction;

    @NotNull(message = "Penalty amount is required.")
    @Min(value = 0, message = "Penalty amount must be a positive number.")
    private double penaltyAmount;
}
