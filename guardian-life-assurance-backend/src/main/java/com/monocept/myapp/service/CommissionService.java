package com.monocept.myapp.service;

import java.sql.Date;
import java.time.LocalDate;
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

import com.monocept.myapp.dto.CommissionResponseDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.Commission;
import com.monocept.myapp.enums.CommissionType;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CommissionRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class CommissionService {

    @Autowired
    private CommissionRepository commissionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    
    @Autowired
    private AgentRepository agentRepository;

    public PagedResponse<CommissionResponseDto> getCommissionsWithFilters(int page, int size, String sortBy,
                                                              String direction, Long agentId, 
                                                              CommissionType commissionType,
                                                              LocalDate from, LocalDate to, Double amount) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) 
                    ? Sort.by(sortBy).descending() 
                    : Sort.by(sortBy).ascending();

        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Commission> commissionPage = commissionRepository.findAllCommissions(agentId, commissionType, from, to, amount, pageRequest);

        List<CommissionResponseDto> commissions = commissionPage.getContent().stream().map(commission->convertCommissionToCommissionResponseDto(commission)).collect(Collectors.toList());
        

        return new PagedResponse<>(commissions, commissionPage.getNumber(), commissionPage.getSize(),
                commissionPage.getTotalElements(), commissionPage.getTotalPages(), commissionPage.isLast());
    }

	private CommissionResponseDto convertCommissionToCommissionResponseDto(Commission commission) {
		CommissionResponseDto commissionResponseDto=new CommissionResponseDto();
		commissionResponseDto.setAgentId(commission.getAgent().getAgentId());
		commissionResponseDto.setAgentName(commission.getAgent().getFirstName()+" "+commission.getAgent().getLastName());
		commissionResponseDto.setAmount(commission.getAmount());
		commissionResponseDto.setCommissionId(commission.getCommissionId());
		commissionResponseDto.setCommissionType(commission.getCommissionType().toString());
		commissionResponseDto.setIssueDate(commission.getIssueDate());
		return commissionResponseDto;
	}

	public PagedResponse<CommissionResponseDto> getCommissionsWithFilters(int page, int size, String sortBy,
			String direction, CommissionType commissionType, LocalDate from, LocalDate to, Double amount) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();

    PageRequest pageRequest = PageRequest.of(page, size, sort);
    Page<Commission> commissionPage = commissionRepository.findAllCommissions(getAgentFromSecurityContext().getAgentId(), commissionType, from, to, amount, pageRequest);

    List<CommissionResponseDto> commissions = commissionPage.getContent().stream().map(commission->convertCommissionToCommissionResponseDto(commission)).collect(Collectors.toList());
    

    return new PagedResponse<>(commissions, commissionPage.getNumber(), commissionPage.getSize(),
            commissionPage.getTotalElements(), commissionPage.getTotalPages(), commissionPage.isLast());
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
	
}
