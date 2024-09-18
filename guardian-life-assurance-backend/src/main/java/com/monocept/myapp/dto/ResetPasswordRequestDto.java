package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {
	private String usernameOrEmail;
	private String otp;
	private String newPassword;
	private String confirmPassword;
}
