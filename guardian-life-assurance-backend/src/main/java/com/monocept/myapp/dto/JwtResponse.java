package com.monocept.myapp.dto;

public class JwtResponse {
	private String usernameOrEmail;
	private String role;

	public JwtResponse(String usernameOrEmail, String role) {
		this.usernameOrEmail = usernameOrEmail;
		this.role = role;
	}

	public String getUsernameOrEmail() {
		return usernameOrEmail;
	}

	public void setUsernameOrEmail(String usernameOrEmail) {
		this.usernameOrEmail = usernameOrEmail;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
