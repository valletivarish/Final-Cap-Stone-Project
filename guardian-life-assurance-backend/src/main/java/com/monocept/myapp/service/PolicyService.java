package com.monocept.myapp.service;

import com.monocept.myapp.dto.PolicyAccountResponseDto;
import com.monocept.myapp.util.PagedResponse;

public interface PolicyService {

	PagedResponse<PolicyAccountResponseDto> getAllPoliciesByAgentWithFilters(int page, int size, String sortBy,
			String direction, Long policyNumber, String premiumType, String status);

}
