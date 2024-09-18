package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class EmployeeResponseDto {
	private long employeeId;

	private long userId;
	private String username;
	private String firstName;

	private String lastName;
	private String email;

	private boolean status;

}
