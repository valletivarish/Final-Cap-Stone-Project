package com.monocept.myapp.service;

import com.monocept.myapp.dto.AgentRequestDto;
import com.monocept.myapp.dto.AgentResponseDto;
import com.monocept.myapp.dto.ReferralEmailRequestDto;
import com.monocept.myapp.util.PagedResponse;

public interface AgentManagementService {

	String createAgent(AgentRequestDto agentRequestDto);

	PagedResponse<AgentResponseDto> getAllAgents(int page, int size, String sortBy, String direction, String city, String state, Boolean isActive, String name);

	String updateAgent(AgentRequestDto agentRequestDto);

	String deleteAgent(long id);

	AgentResponseDto getAgentById(long agentId);

	AgentResponseDto getAgentProfile();

	String sendRecommendationEmail(ReferralEmailRequestDto referralEmailRequestDto);

	Double getTotalCommission();

	String activateAgent(long agentId);


	

}
