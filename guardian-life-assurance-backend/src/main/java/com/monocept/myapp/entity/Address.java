package com.monocept.myapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Table(name = "address")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addressId")
    private Long addressId; 

    @Column(name = "houseNo")
    @NotEmpty(message = "House number is required")
    private String houseNo;

    @Column(name = "apartment")
    @NotEmpty(message = "Apartment name is required")
    private String apartment;

    @Column(name = "pincode")
    @Min(value = 100000, message = "Pincode must have at least 6 digits")
    @Max(value = 999999, message = "Pincode must have at most 6 digits")
    private int pincode;

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "cityId")
    private City city;

}
