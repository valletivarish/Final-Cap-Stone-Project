package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "insurance_settings")
public class InsuranceSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double claimDeduction;

    private double penaltyAmount;
    
    private LocalDateTime updatedAt=LocalDateTime.now();
}
