package com.monocept.myapp.entity;

import com.monocept.myapp.enums.DocumentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "submittedDocuments")
@Data
public class SubmittedDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "documentId")
    private Long documentId; 

    @Column(name = "documentName")
    private String documentName;

    @Column(name = "documentStatus")
    private DocumentStatus documentStatus;

    @Column(name = "documentImage")
    private String documentImage;
}
