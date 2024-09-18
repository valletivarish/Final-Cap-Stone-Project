package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class DocumentRequestDto {
	private int documentId;
	private byte[] document;
}
