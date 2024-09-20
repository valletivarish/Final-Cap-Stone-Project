package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
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
@Table(name = "query")
@Data
public class CustomerQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "queryId")
    private Long queryId;

    @NotEmpty(message = "Title is required")
    @Column(name = "title")
    private String title;

    @NotEmpty(message = "Message is required")
    @Column(name = "message",length = 65535, columnDefinition = "TEXT")
    private String message;

    @Column(length = 65535, columnDefinition = "TEXT")
    private String response;

    @Column(name = "isResolved")
    private boolean resolved = false;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "resolved_by_employee_id", referencedColumnName = "employeeId")
    private Employee resolvedBy;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "customerId", referencedColumnName = "customerId")
    private Customer customer;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
