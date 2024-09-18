package com.monocept.myapp.service;

import java.io.IOException;
import java.util.List;

import com.monocept.myapp.dto.ClaimRequestDto;
import com.monocept.myapp.dto.ClaimResponseDto;
import com.monocept.myapp.enums.ClaimStatus;
import com.monocept.myapp.util.PagedResponse;

public interface ClaimService {



	ClaimResponseDto createCustomerClaim(Long customerId, ClaimRequestDto claimRequestDto) throws IOException;

	List<ClaimResponseDto> getAllClaimsByCustomerId(Long customerId);

	String approveClaim(Long claimId);

	String rejectClaim(Long claimId);

	PagedResponse<ClaimResponseDto> getAllClaimsWithFilters(int page, int size, String sortBy, String direction,
			ClaimStatus status, Long customerId, Long policyNo);

	PagedResponse<ClaimResponseDto> getAgentClaims(int page, int size, String sortBy, String direction);

}
