package com.monocept.myapp.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequestDto {

    private long customerId;

    @NotBlank(message = "First name is required.")
    private String firstName;

    @NotBlank(message = "Last name is required.")
    private String lastName;

    @NotNull(message = "Date of birth is required.")
    @Past(message = "Date of birth must be a past date.")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Phone number is required.")
    @Size(max = 10, message = "Phone number must be 10 digits.")
    private String phoneNumber;

    private boolean active;

    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    private String username;

    @NotBlank(message = "Email is required.")
    @Email(message = "Email should be valid.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @NotBlank(message = "House number is required.")
    private String houseNo;
    @Size(max = 50, message = "Apartment name must be less than 50 characters.")
    private String apartment;

    @Min(value = 100000, message = "Pincode must be at least 6 digits.")
    @Max(value = 999999, message = "Pincode must be at most 6 digits.")
    private int pincode;


    @NotNull(message = "State ID is required.")
    private Long stateId;

    @NotNull(message = "City ID is required.")
    private Long cityId;
}
