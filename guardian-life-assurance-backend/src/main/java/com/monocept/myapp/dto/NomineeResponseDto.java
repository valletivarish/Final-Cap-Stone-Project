package com.monocept.myapp.dto;

import com.monocept.myapp.enums.NomineeRelationship;

import lombok.Data;

@Data
public class NomineeResponseDto {
	
    private String nomineeName;

    private NomineeRelationship relationship;
}
