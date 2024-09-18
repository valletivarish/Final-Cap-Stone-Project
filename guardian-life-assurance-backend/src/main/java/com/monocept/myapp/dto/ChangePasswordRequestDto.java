package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class ChangePasswordRequestDto {
	private String existingPassword;
	private String newPassword;
	private String confirmPassword;
}
