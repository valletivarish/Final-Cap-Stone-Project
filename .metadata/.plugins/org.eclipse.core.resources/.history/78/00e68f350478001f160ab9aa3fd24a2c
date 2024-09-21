package com.monocept.myapp.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.monocept.myapp.enums.PolicyStatus;
import com.monocept.myapp.enums.PremiumType;

import jakarta.persistence.Column;
import lombok.Data;

@Data
@JsonInclude(value = Include.NON_NULL)
public class PolicyAccountResponseDto {
	private String customerName;
	private String customerCity;
	private String customerState;
	private String email;
	private String phoneNumber;
	private String agentName;
	private long policyNo;
	private String insurancePlan;
	private String insuranceScheme;
	private LocalDate DateCreated;
	private LocalDate maturityDate;
	private PremiumType premiumType;
	private double premiumAmount;
	private double profitRatio;
	private double sumAssured;
	private PolicyStatus policyStatus;
	private List<PaymentResponseDto> payments;
	private List<InstallmentResponseDto> installments;

}
