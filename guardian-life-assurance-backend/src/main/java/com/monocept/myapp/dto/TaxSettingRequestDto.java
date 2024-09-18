package com.monocept.myapp.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaxSettingRequestDto {

    @NotNull(message = "Tax percentage is required.")
    @Min(value = 0, message = "Tax percentage must be a positive number.")
    private Double taxPercentage;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
