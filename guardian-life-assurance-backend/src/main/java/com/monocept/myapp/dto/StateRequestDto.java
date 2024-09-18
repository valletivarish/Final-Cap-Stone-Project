package com.monocept.myapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StateRequestDto {
	private Long id;
	@NotBlank
	@Size(min = 3,max = 20)
	private String name;
	
	private boolean active;
}
