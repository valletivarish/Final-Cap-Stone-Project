package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Data
@Table(name = "insurance_settings")
public class InsuranceSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 0, message = "Claim deduction percentage cannot be less than 0")
    @Max(value = 100, message = "Claim deduction percentage cannot be more than 100")
    private double claimDeductionPercentage;
    @Min(value = 0, message = "Penalty deduction percentage cannot be less than 0")
    @Max(value = 100, message = "Penalty deduction percentage cannot be more than 100")
    private double penaltyDeductionPercentage;
    
    private LocalDateTime updatedAt=LocalDateTime.now();
}
