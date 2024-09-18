package com.monocept.myapp.dto;

import java.time.LocalDate;

import com.monocept.myapp.enums.PaymentStatus;

import lombok.Data;

@Data
public class PaymentResponseDto {
    private Long paymentId;
    private Double amount;
    private long policyNo;
    private PaymentStatus status;
    private LocalDate paymentDate;
}
