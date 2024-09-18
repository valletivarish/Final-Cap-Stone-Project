package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.enums.WithdrawalRequestType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "withdrawal_requests")
public class WithdrawalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long withdrawalRequestId;

    // For agent commission withdrawal
    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = true)
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WithdrawalRequestType requestType;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WithdrawalRequestStatus status;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
