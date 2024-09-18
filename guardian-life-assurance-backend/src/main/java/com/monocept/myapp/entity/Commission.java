package com.monocept.myapp.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import com.monocept.myapp.enums.CommissionType;

import jakarta.persistence.CascadeType;
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
@Table(name = "commission")
@Data
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commissionId")
    private long commissionId;

    @Column(name = "commissionType")
    private CommissionType commissionType;

    @Column(name = "issueDate")
    @CreationTimestamp
    private LocalDate issueDate;

    @Column(name = "amount")
    private double amount;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "agentId", referencedColumnName = "agentId")
    private Agent agent;
}
