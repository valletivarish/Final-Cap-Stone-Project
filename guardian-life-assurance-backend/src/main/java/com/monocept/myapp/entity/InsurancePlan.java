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
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Table(name = "insurancePlan")
@Data
public class InsurancePlan {

    @Id
    @Column(name = "planId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @Column(name = "planName")
    @NotEmpty(message = "Plan name is required")
    private String planName;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    private List<InsuranceScheme> scheme;

    @Column(name = "status")
    private boolean isActive = true;
}
