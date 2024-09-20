package com.monocept.myapp.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.monocept.myapp.enums.PolicyStatus;
import com.monocept.myapp.enums.PremiumType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "insurancePolicies")
@Data
public class PolicyAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policyNo")
    private long policyNo;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "schemeId", referencedColumnName = "schemeId")
    private InsuranceScheme insuranceScheme;
    
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "customerId", referencedColumnName = "customerId")
    private Customer customer;

    @Column(name = "issueDate")
    @CreationTimestamp
    private LocalDate issueDate=LocalDate.now(); 

    @Column(name = "maturityDate")
    private LocalDate maturityDate; 

    @Column(name = "premiumType")
    private PremiumType premiumType; 

    @Column(name = "sumAssured")
    private Double sumAssured;
    
    @Column(name = "policyTerm") 
    private Long policyTerm;

    @Column(name = "premiumAmount")
    private Double premiumAmount;
    
    private Double installmentAmount;
    
    private Double totalPaidAmount;
   
    
    @OneToMany(mappedBy = "insurancePolicy", cascade = CascadeType.ALL)
    private List<Installment> installments;

    @Column(name = "status")
    private PolicyStatus status = PolicyStatus.PENDING;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "agentId", referencedColumnName = "agentId")
    private Agent agent;

    @OneToMany(mappedBy = "policyAccount", cascade = CascadeType.ALL)
    private List<Nominee> nominees;

    @OneToMany(mappedBy = "policyAccount", cascade = CascadeType.ALL)
    private List<Payment> payments;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "claim")
    private Claim claims;
    
    @ManyToOne 
    @JoinColumn(name = "tax_id", referencedColumnName = "taxId")
    private TaxSetting taxSetting;
    
    private LocalDateTime cancellationDate;
    
    @ManyToOne
    private InsuranceSetting insuranceSetting;
}
