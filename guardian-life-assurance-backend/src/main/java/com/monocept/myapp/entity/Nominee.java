package com.monocept.myapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Entity
@Table(name = "nominee")
@Data
public class Nominee {

    @Id
    @Column(name = "nomineeId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nomineeId;

    @NotEmpty(message = "Nominee name is required")
    @Column(name = "nomineeName")
    private String nomineeName;

    @Column(name = "relationship")
    @NotEmpty(message = "Relationship is required")
    private String relationship;
    
    @ManyToOne
    @JoinColumn(name = "policy_no", referencedColumnName = "policyNo")
    private PolicyAccount policyAccount;

}
