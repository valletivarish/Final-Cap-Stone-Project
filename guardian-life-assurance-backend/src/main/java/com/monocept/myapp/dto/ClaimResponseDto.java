package com.monocept.myapp.dto;

import java.time.LocalDateTime;

import com.monocept.myapp.enums.ClaimStatus;

import lombok.Data;

@Data
public class ClaimResponseDto {
    private long claimId;
    private long policyNo;
    private long customerId;
    private double claimAmount;
    private String claimReason;
    private LocalDateTime claimDate;
    private ClaimStatus status;
    private LocalDateTime approvalDate;
    private LocalDateTime rejectionDate;
}

