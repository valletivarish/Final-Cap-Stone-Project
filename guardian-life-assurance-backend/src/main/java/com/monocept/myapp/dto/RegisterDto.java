package com.monocept.myapp.dto;

import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
	@NotBlank
    private String username;
	@Email
	@NotBlank
    private String email;
	@Size(min = 8,max=14)
	@NotBlank
    private String password;
	@NotBlank
	@Size(min = 3,max = 50)
	private String name;
	
	private boolean active;


    private Set<String> roles;
}
