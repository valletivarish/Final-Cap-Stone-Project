package com.monocept.myapp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

@Data
@JsonInclude(value = Include.NON_NULL)
public class CityResponseDto {
    private long id;
    private String city;
    private boolean active;
    private String state; 
}