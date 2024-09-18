package com.monocept.myapp.dto;

import java.util.List;

import lombok.Data;

@Data
public class AgentResponseDto {
	private long agentId;
	private String firstName;
	private String lastName;
	private String email;
	private String username;
	private boolean status;
	private String houseNo;
	private String apartment;
	private int pincode;
	private String state;
	private String city;
	private List<CommissionResponseDto> commissions;
}
