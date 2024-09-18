package com.monocept.myapp.dto;

import com.monocept.myapp.enums.DocumentType;

import lombok.Data;

@Data
public class DocumentResponseDto {
	private int documentId;
    private DocumentType documentName;  
    private boolean verified;            
    private String customerName;         
    private String verifiedBy;
}
