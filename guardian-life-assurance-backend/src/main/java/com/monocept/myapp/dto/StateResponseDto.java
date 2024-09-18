package com.monocept.myapp.dto;

import java.util.List;

import lombok.Data;

@Data
public class StateResponseDto {
	private long id;
	private String name;
	private boolean active;
	private List<CityResponseDto> cities;
}
