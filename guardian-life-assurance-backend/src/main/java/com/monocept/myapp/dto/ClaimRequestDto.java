package com.monocept.myapp.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ClaimRequestDto {
    private long policyNo;
    private double claimAmount;
    private String claimReason;
    private MultipartFile document;
}
