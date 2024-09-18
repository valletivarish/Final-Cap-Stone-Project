package com.monocept.myapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AgentRequestDto {

    private long agentId;

    @NotBlank(message = "First name is required.")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters.")
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters.")
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 20, message = "Username must be between 4 and 20 characters.")
    private String username;

    @NotBlank(message = "House number is required.")
    @Size(max = 10, message = "House number must be less than 10 characters.")
    private String houseNo;

    @Size(max = 50, message = "Apartment name must be less than 50 characters.")
    private String apartment;

    @Min(value = 100000, message = "Pincode must be at least 6 digits.")
    private int pincode;

    @NotNull(message = "State ID is required.")
    private long stateId;

    @NotNull(message = "City ID is required.")
    private long cityId;
}
