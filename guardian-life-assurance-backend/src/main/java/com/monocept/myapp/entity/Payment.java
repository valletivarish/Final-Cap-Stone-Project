package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.monocept.myapp.enums.PaymentStatus;

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
@Table(name = "payments")
@Data
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "paymentId")
	private Long paymentId;

	@Column(name = "chargeId", nullable = false, unique = true)
	private String chargeId;

	@Column(name = "customerId", nullable = false)
	private long customerId;

	@Column(name = "amount", nullable = false)
	private double amount;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private PaymentStatus status;

	@CreationTimestamp
	@Column(name = "paymentDate", nullable = false, updatable = false)
	private LocalDateTime paymentDate;
	
	@ManyToOne
    @JoinColumn(name = "policyNo", referencedColumnName = "policyNo")
    private PolicyAccount policyAccount;
}
