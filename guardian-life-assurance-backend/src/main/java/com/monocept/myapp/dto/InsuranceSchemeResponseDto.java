package com.monocept.myapp.dto;

import lombok.Data;

@Data
public class InsuranceSchemeResponseDto {

    private long schemeId;

    private String schemeName;

    private boolean active;
    private long planId;
    
    private String planName;
    
    private String image;

    private String detailDescription;
    private Double minAmount;
    private Double maxAmount;
    private int minPolicyTerm;
    private Integer maxPolicyTerm;
    private int minAge;
    private Integer maxAge;
    private Double profitRatio;
    private Double registrationCommAmount;
    private Double installmentCommRatio;


}
