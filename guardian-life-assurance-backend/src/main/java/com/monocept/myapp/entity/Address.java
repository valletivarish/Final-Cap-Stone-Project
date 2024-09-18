package com.monocept.myapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "address")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addressId")
    private Long addressId; 

    private String houseNo;

    private String apartment;

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "cityId")
    private City city;

//    @ManyToOne
//    @JoinColumn(name = "state_id", referencedColumnName = "stateId")
//    private State state;

    @Column(name = "pincode")
    private int pincode;
}
