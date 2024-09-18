package com.monocept.myapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.PolicyAccountResponseDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.PolicyAccount;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.PolicyRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class PolicyServiceImpl implements PolicyService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AgentRepository agentRepository;
	
	@Autowired
	private PolicyRepository policyRepository;
	
	@Override
	public PagedResponse<PolicyAccountResponseDto> getAllPoliciesByAgentWithFilters(int page, int size, String sortBy,
			String direction, Long policyNumber, String premiumType, String status) {
		 Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	        PageRequest pageRequest = PageRequest.of(page, size, sort);

	        Page<PolicyAccount> policyPage = policyRepository.findAllByAgentWithFilters(getAgentFromSecurityContext().getAgentId(), policyNumber, premiumType, status, pageRequest);
	        List<PolicyAccountResponseDto> policies = policyPage.getContent().stream().map(this::convertToPolicyResponseDto).collect(Collectors.toList());

	        return new PagedResponse<>(policies, policyPage.getNumber(), policyPage.getSize(), policyPage.getTotalElements(), policyPage.getTotalPages(), policyPage.isLast());
	}
	
	private Agent getAgentFromSecurityContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			
			return agentRepository.findByUser(
				    userRepository.findByUsernameOrEmail(
				        userDetails.getUsername(), 
				        userDetails.getUsername()
				    ).orElseThrow(() -> new GuardianLifeAssuranceException.UserNotFoundException("User not found"))
				);
		}
		throw new GuardianLifeAssuranceException.UserNotFoundException("agent not found");
	}
	private PolicyAccountResponseDto convertToPolicyResponseDto(PolicyAccount policy) {
		PolicyAccountResponseDto policyDto = new PolicyAccountResponseDto();

		if (policy.getAgent() != null) {
			policyDto.setAgentName(policy.getAgent().getFirstName() + " " + policy.getAgent().getLastName());
		}

		Customer customer = policy.getCustomer();
		policyDto.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
		policyDto.setCustomerCity(customer.getAddress().getCity().getName());
		policyDto.setCustomerState(customer.getAddress().getCity().getState().getName());
		policyDto.setEmail(customer.getUser().getEmail());
		policyDto.setPhoneNumber(customer.getPhoneNumber());
		policyDto.setPolicyNo(policy.getPolicyNo());
		policyDto.setPolicyStatus(policy.getStatus());

		if (policy.getInsuranceScheme().getInsurancePlan() != null) {
			policyDto.setInsurancePlan(policy.getInsuranceScheme().getInsurancePlan().getPlanName());
		}

		policyDto.setInsuranceScheme(policy.getInsuranceScheme().getSchemeName());
		policyDto.setDateCreated(policy.getIssueDate());
		policyDto.setMaturityDate(policy.getMaturityDate());
		policyDto.setPremiumType(policy.getPremiumType());
		policyDto.setPremiumAmount(policy.getPremiumAmount());
		policyDto.setProfitRatio(policy.getInsuranceScheme().getProfitRatio());
		policyDto.setSumAssured(policy.getSumAssured());
        return policyDto; 
    }
	
	
}
