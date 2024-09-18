package com.monocept.myapp.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "state")
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stateId")
    private Long stateId;

    @Column(name = "name")
    private String name;

    @Column(name = "isActive")
    private boolean active = true;
    
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "state")
    private List<City> city;
}