package com.monocept.myapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.WithdrawalResponseDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.AgentEarnings;
import com.monocept.myapp.entity.WithdrawalRequest;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.enums.WithdrawalRequestType;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.AgentEarningsRepository;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.UserRepository;
import com.monocept.myapp.repository.WithdrawalRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {
	@Autowired
	private WithdrawalRepository withdrawalRepository;

	@Autowired
	private AgentRepository agentRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AgentEarningsRepository agentEarningsRepository;

	@Override
	public void approveWithdrawal(long withdrawalId) {
		WithdrawalRequest withdrawalRequest = withdrawalRepository.findById(withdrawalId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Withdrawal request not found with ID: " + withdrawalId));

		if (!withdrawalRequest.getStatus().equals(WithdrawalRequestStatus.PENDING)) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
					"Only pending withdrawal requests can be approved.");
		}
		Agent agent = withdrawalRequest.getAgent();
		AgentEarnings agentEarnings=new AgentEarnings();
		agentEarnings.setAgent(agent);
		agentEarnings.setAmount(withdrawalRequest.getAmount());
		agentEarnings.setWithdrawalDate(LocalDateTime.now());
		agentEarningsRepository.save(agentEarnings);
		withdrawalRequest.setStatus(WithdrawalRequestStatus.APPROVED);
		withdrawalRequest.setApprovedAt(LocalDateTime.now());
		withdrawalRepository.save(withdrawalRequest);
		emailService.sendWithdrawalApprovalMail(withdrawalRequest);
	}

	@Override
	public void rejectWithdrawal(long withdrawalId) {
		WithdrawalRequest withdrawalRequest = withdrawalRepository.findById(withdrawalId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Withdrawal request not found with ID: " + withdrawalId));

		if (!withdrawalRequest.getStatus().equals(WithdrawalRequestStatus.PENDING)) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
					"Only pending withdrawal requests can be rejected.");
		}
		Agent agent = withdrawalRequest.getAgent();
		agent.setTotalCommission(agent.getTotalCommission()+withdrawalRequest.getAmount());
		withdrawalRequest.setStatus(WithdrawalRequestStatus.REJECTED);
		withdrawalRepository.save(withdrawalRequest);
	}

	@Override
	public void createAgentWithdrawalRequest(double amount) {
		Agent agent = agentRepository.findById(getAgentFromSecurityContext().getAgentId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Agent not found with ID: " + getAgentFromSecurityContext().getAgentId()));
		if (amount > agent.getTotalCommission()) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "No sufficient commission balance");
		}
		WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
		agent.setTotalCommission(agent.getTotalCommission()-amount);
		agentRepository.save(agent);
		withdrawalRequest.setAgent(agent);

		withdrawalRequest.setAmount(amount);
		withdrawalRequest.setRequestDate(LocalDateTime.now());
		withdrawalRequest.setStatus(WithdrawalRequestStatus.PENDING);
		withdrawalRequest.setRequestType(WithdrawalRequestType.COMMISSION_WITHDRAWAL);

		withdrawalRepository.save(withdrawalRequest);
	}

	@Override
	public PagedResponse<WithdrawalRequest> getWithdrawalsWithFilters(Long customerId, Long agentId,
			WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate, int page, int size, String sortBy,
			String direction) {

		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();

		Pageable pageable = PageRequest.of(page, size, sort);

		Page<WithdrawalRequest> withdrawalPage = withdrawalRepository.findWithFilters(customerId, agentId, status,
				fromDate, toDate, pageable);

		List<WithdrawalRequest> withdrawals = withdrawalPage.getContent();

		return new PagedResponse<>(withdrawals, withdrawalPage.getNumber(), withdrawalPage.getSize(),
				withdrawalPage.getTotalElements(), withdrawalPage.getTotalPages(), withdrawalPage.isLast());
	}

	@Override
	public PagedResponse<WithdrawalResponseDto> getCommissionWithdrawalsWithFilters(int page, int size, String sortBy,
			String direction, Long agentId, WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();
		PageRequest pageRequest = PageRequest.of(page, size, sort);
		LocalDateTime fromDateTime = (fromDate != null) ? fromDate.atStartOfDay() : null;
		LocalDateTime toDateTime = (toDate != null) ? toDate.atTime(23, 59) : null;
		Page<WithdrawalRequest> withdrawalPage = withdrawalRepository.findCommissionWithdrawals(agentId, status,
				fromDateTime, toDateTime, pageRequest);
		List<WithdrawalResponseDto> withdrawals = withdrawalPage.getContent().stream()
				.map(withdrawalRequest -> convertWithdrawalToDto(withdrawalRequest)).collect(Collectors.toList());

		return new PagedResponse<>(withdrawals, withdrawalPage.getNumber(), withdrawalPage.getSize(),
				withdrawalPage.getTotalElements(), withdrawalPage.getTotalPages(), withdrawalPage.isLast());
	}

	private WithdrawalResponseDto convertWithdrawalToDto(WithdrawalRequest withdrawalRequest) {
		WithdrawalResponseDto responseDto = new WithdrawalResponseDto();
		responseDto.setAgentId(withdrawalRequest.getAgent().getAgentId());
		responseDto.setAmount(withdrawalRequest.getAmount());
		responseDto.setApprovedAt(toLocalDate(withdrawalRequest.getApprovedAt()));
		responseDto.setRequestDate(toLocalDate(withdrawalRequest.getRequestDate()));
		responseDto.setWithdrawalRequestId(withdrawalRequest.getWithdrawalRequestId());
		responseDto.setStatus(withdrawalRequest.getStatus());
		responseDto.setRequestType(withdrawalRequest.getRequestType());
		responseDto.setAgentName(
				withdrawalRequest.getAgent().getFirstName() + " " + withdrawalRequest.getAgent().getLastName());
		return responseDto;
	}

	public static LocalDate toLocalDate(LocalDateTime dateTime) {
		return dateTime != null ? dateTime.toLocalDate() : null;
	}

	@Override
	public PagedResponse<WithdrawalResponseDto> getCommissionWithdrawalsWithFilters(int page, int size, String sortBy,
			String direction, WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();
		PageRequest pageRequest = PageRequest.of(page, size, sort);
		LocalDateTime fromDateTime = (fromDate != null) ? fromDate.atStartOfDay() : null;
		LocalDateTime toDateTime = (toDate != null) ? toDate.atTime(23, 59) : null;
		Page<WithdrawalRequest> withdrawalPage = withdrawalRepository.findCommissionWithdrawals(
				getAgentFromSecurityContext().getAgentId(), status, fromDateTime, toDateTime, pageRequest);
		List<WithdrawalResponseDto> withdrawals = withdrawalPage.getContent().stream()
				.map(withdrawalRequest -> convertWithdrawalToDto(withdrawalRequest)).collect(Collectors.toList());
		return new PagedResponse<>(withdrawals, withdrawalPage.getNumber(), withdrawalPage.getSize(),
				withdrawalPage.getTotalElements(), withdrawalPage.getTotalPages(), withdrawalPage.isLast());
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