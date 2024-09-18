package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class ReferralEmailRequestDto {
	private Long customerId;
	private String recipientEmail;
    private String referralLink;
    private Long schemeId; 
}
