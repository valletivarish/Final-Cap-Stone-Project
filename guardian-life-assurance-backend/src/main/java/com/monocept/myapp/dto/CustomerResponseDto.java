package com.monocept.myapp.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class CustomerResponseDto {
	private String firstName;
	private long customerId;

	private String lastName;
	private long userId;
	private LocalDate dateOfBirth;

	private String phoneNumber;

	private boolean active;

	private String username;
	private String email;
	private String houseNo;
	private String apartment;
	private int pincode;
	private String state;
	private String city;
	private List<PolicyAccountResponseDto> policyAccounts;
}
