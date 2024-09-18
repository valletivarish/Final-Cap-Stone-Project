package com.monocept.myapp.entity;

import com.monocept.myapp.enums.DocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "document")
@Data
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "documentId")
    private int documentId;

    @Column(name = "document_name")
    private DocumentType documentName;

    @Column(name = "verified")
    private boolean verified;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "customerId")
    private Customer customer; 
    
    @ManyToOne
    @JoinColumn(name = "verified_by", referencedColumnName = "employeeId")
    private Employee verifyBy;

    @Lob
    @Column(name = "content", columnDefinition = "LONGBLOB")
    private byte[] content; 
}
