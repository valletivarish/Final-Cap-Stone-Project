package com.monocept.myapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.AgentEarningsResponseDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.AgentEarnings;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.AgentEarningsRepository;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class AgentEarningsServiceImpl implements AgentEarningsService {
	@Autowired
	private AgentEarningsRepository agentEarningsRepository;

	@Autowired
	private AgentRepository agentRepository;

	@Autowired
	private UserRepository userRepository;

	public PagedResponse<AgentEarningsResponseDto> getAgentEarningsWithFilters(Double minAmount, Double maxAmount,
			LocalDateTime fromDate, LocalDateTime toDate, int page, int size) {
		PageRequest pageRequest = PageRequest.of(page, size);

		Page<AgentEarnings> earnings = agentEarningsRepository.findWithFilters(
				getAgentFromSecurityContext().getAgentId(), minAmount, maxAmount, fromDate, toDate, pageRequest);
		List<AgentEarningsResponseDto> earningsResponse = earnings.getContent().stream()
				.map(earning -> convertAgentToAgentResponseDto(earning)).collect(Collectors.toList());
		return new PagedResponse<>(earningsResponse, earnings.getNumber(), earnings.getSize(),
				earnings.getTotalElements(), earnings.getTotalPages(), earnings.isLast());

	}

	private AgentEarningsResponseDto convertAgentToAgentResponseDto(AgentEarnings earning) {
		AgentEarningsResponseDto dto = new AgentEarningsResponseDto();
		dto.setId(earning.getId());
		dto.setAgentId(earning.getAgent().getAgentId());
		dto.setName(earning.getAgent().getFirstName() + " " + earning.getAgent().getLastName());
		dto.setAmount(earning.getAmount());
		dto.setWithdrawalDate(earning.getWithdrawalDate());
		return dto;
	}

	private Agent getAgentFromSecurityContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			return agentRepository.findByUser(userRepository
					.findByUsernameOrEmail(userDetails.getUsername(), userDetails.getUsername())
					.orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException("User not found")));
		}
		throw new GuardianLifeAssuranceException.UserNotFoundException("agent not found");
	}
}
