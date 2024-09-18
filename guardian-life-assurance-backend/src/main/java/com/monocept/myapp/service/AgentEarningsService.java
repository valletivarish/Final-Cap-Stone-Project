package com.monocept.myapp.service;


import java.time.LocalDateTime;

import com.monocept.myapp.dto.AgentEarningsResponseDto;
import com.monocept.myapp.util.PagedResponse;

public interface AgentEarningsService {

	PagedResponse<AgentEarningsResponseDto> getAgentEarningsWithFilters(Double minAmount, Double maxAmount,
			LocalDateTime fromDate, LocalDateTime toDate, int page, int size);

    
}
