package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class AdminResponseDto {
	private long adminId;

	private String username;

	private String email;

	private boolean active;

}
