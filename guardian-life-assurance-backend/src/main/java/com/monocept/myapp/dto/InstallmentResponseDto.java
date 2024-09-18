package com.monocept.myapp.dto;

import java.time.LocalDate;

import com.monocept.myapp.enums.InstallmentStatus;

import lombok.Data;

@Data
public class InstallmentResponseDto {
    private Long installmentId;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private Double amountDue;
    private Double amountPaid;
    private InstallmentStatus status;
}
