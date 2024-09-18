package com.monocept.myapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CityRequestDto {

    private long id;

    @NotBlank(message = "City name is required.")
    @NotNull(message = "City name cannot be null.")
    private String name;

    @NotNull(message = "Active status is required.")
    private boolean active=true;
}
