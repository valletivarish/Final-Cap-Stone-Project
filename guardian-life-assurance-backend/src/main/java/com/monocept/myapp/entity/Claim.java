package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import com.monocept.myapp.enums.ClaimStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long claimId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyAccount policyAccount;

    @Column(nullable = false)
    private LocalDateTime claimDate;

    @Column(length = 65535, columnDefinition = "TEXT")
    private String claimReason;
    
    @Lob
    @Column(name = "document", nullable = true,columnDefinition = "LONGBLOB") 
    private byte[] document;

    @Column(nullable = false)
    private double claimAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    private LocalDateTime approvalDate;
    private LocalDateTime rejectionDate;
}
