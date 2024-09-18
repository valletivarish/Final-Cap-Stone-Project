package com.monocept.myapp.dto;

import java.time.LocalDate;

import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.enums.WithdrawalRequestType;

import lombok.Data;

@Data
public class WithdrawalResponseDto {
	private long withdrawalRequestId;
	private long agentId;
	private String agentName;
	private String customerName;
	private String customerId;

	private Double amount;

	private LocalDate requestDate;

	private LocalDate approvedAt;

	private WithdrawalRequestType requestType;

	private WithdrawalRequestStatus status;

}
