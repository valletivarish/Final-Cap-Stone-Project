package com.monocept.myapp.entity;

import java.time.LocalDate;

import com.monocept.myapp.enums.InstallmentStatus;

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
@Table(name = "installments")
@Data
public class Installment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "installmentId")
    private Long installmentId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "policyNo", referencedColumnName = "policyNo")
    private PolicyAccount insurancePolicy;

    @Column(name = "dueDate", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paymentDate")
    private LocalDate paymentDate;

    @Column(name = "amountDue", nullable = false)
    private Double amountDue;

    @Column(name = "amountPaid")
    private Double amountPaid;

    @Column(name = "status")
    private InstallmentStatus status = InstallmentStatus.PENDING; 
    private String paymentReference;
}
