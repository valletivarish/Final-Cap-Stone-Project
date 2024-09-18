package com.monocept.myapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @NotEmpty(message = "Relationship is required")
    @Column(name = "relationship")
    private String relationship;
}
