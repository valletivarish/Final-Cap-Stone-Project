package com.monocept.myapp.dto;

import com.monocept.myapp.enums.NomineeRelationship;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class NomineeDto {
    @NotEmpty(message = "Nominee name is required")
    private String nomineeName;

    private NomineeRelationship relationship;
}
