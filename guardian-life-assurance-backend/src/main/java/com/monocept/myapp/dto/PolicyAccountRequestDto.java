package com.monocept.myapp.dto;

import com.monocept.myapp.enums.PremiumType;

import lombok.Data;

@Data
public class PolicyAccountRequestDto {
	
	private String stripeToken;
	private Long insuranceSchemeId;
	private Long agentId;
	private PremiumType premiumType;
	private Long policyTerm;
	private Double premiumAmount;
	
	
//	//Claim
//
//	private String bankName;
//
//	private String branchName;
//
//	private String bankAccountNumber;
//
//	private String ifscCode;
//
//	private Date date;

	// Payment
//	private PaymentType paymentType;
//
//	private Double amount;
//
//	private Date paymentDate;
//
//	private Double tax;
//
//	private Double totalPayment;
//
//	private String cardNumber;
//
//	private int cvv;
//
//	private String expiry;
}
