package com.monocept.myapp.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.myapp.dto.AgentEarningsResponseDto;
import com.monocept.myapp.dto.AgentRequestDto;
import com.monocept.myapp.dto.AgentResponseDto;
import com.monocept.myapp.dto.ClaimResponseDto;
import com.monocept.myapp.dto.CommissionResponseDto;
import com.monocept.myapp.dto.CustomerResponseDto;
import com.monocept.myapp.dto.InsuranceSchemeResponseDto;
import com.monocept.myapp.dto.PaymentResponseDto;
import com.monocept.myapp.dto.PolicyAccountResponseDto;
import com.monocept.myapp.dto.ReferralEmailRequestDto;
import com.monocept.myapp.dto.WithdrawalResponseDto;
import com.monocept.myapp.enums.CommissionType;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.service.AgentEarningsService;
import com.monocept.myapp.service.AgentManagementService;
import com.monocept.myapp.service.ClaimService;
import com.monocept.myapp.service.CommissionService;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.InsuranceManagementService;
import com.monocept.myapp.service.PaymentService;
import com.monocept.myapp.service.PolicyService;
import com.monocept.myapp.service.WithdrawalService;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/guardian-life-assurance/agents")
public class AgentController {

	@Autowired
	private AgentManagementService agentManagementService;

	@Autowired
	private WithdrawalService withdrawalService;

	@Autowired
	private AgentEarningsService agentEarningsService;

	@Autowired
	private CommissionService commissionService;

	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private PolicyService policyService;

	@Autowired
	private ClaimService claimService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private InsuranceManagementService insuranceManagementService;

	@GetMapping("/{agentId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	@Operation(summary = "Get Agent by ID", description = "Retrieve an agent's details using their ID.")
	public ResponseEntity<AgentResponseDto> getAgentById(@PathVariable long agentId) {
		return new ResponseEntity<AgentResponseDto>(agentManagementService.getAgentById(agentId), HttpStatus.OK);
	}

	@PutMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	@Operation(summary = "Update Agent", description = "Update the details of an agent.")
	public ResponseEntity<String> updateAgent(@RequestBody AgentRequestDto agentRequestDto) {
		return new ResponseEntity<String>(agentManagementService.updateAgent(agentRequestDto), HttpStatus.OK);
	}

	@PutMapping("{agentId}/activate")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	@Operation(summary = "Activate Agent", description = "Activate an agent using their ID.")
	public ResponseEntity<String> activateAgent(@PathVariable long agentId) {
		return new ResponseEntity<String>(agentManagementService.activateAgent(agentId), HttpStatus.OK);
	}

	@GetMapping("/earnings")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Agent Earnings", description = "Retrieve the earnings report for the agent with optional filters such as date range and amount range.")
	public ResponseEntity<PagedResponse<AgentEarningsResponseDto>> getAgentEarningsReport(
			@RequestParam(name = "minAmount", required = false) Double minAmount,
			@RequestParam(name = "maxAmount", required = false) Double maxAmount,
			@RequestParam(name = "fromDate", defaultValue = "#{T(java.time.LocalDate).now().minusDays(30).toString()}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate fromDate,
			@RequestParam(name = "toDate", defaultValue = "#{T(java.time.LocalDate).now().toString()}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate toDate,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		LocalDateTime fromFormatedDate = parseDate(fromDate.toString()).atStartOfDay();
		LocalDateTime toFormatedDate = parseDate(toDate.toString()).atTime(23, 59, 59);
		PagedResponse<AgentEarningsResponseDto> earnings = agentEarningsService.getAgentEarningsWithFilters(minAmount,
				maxAmount, fromFormatedDate, toFormatedDate, page, size);
		return ResponseEntity.ok(earnings);
	}

	@PostMapping("/withdrawals")
	@PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
	@Operation(summary = "Create Agent Withdrawal Request", description = "Create a withdrawal request for the agent.")
	public ResponseEntity<String> createAgentWithdrawalRequest(@RequestParam double amount) {
		withdrawalService.createAgentWithdrawalRequest(amount);
		return ResponseEntity.ok("Withdrawal request created successfully");
	}

	@GetMapping("/commission-withdrawal")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Commission Withdrawals", description = "Retrieve a list of commission withdrawal requests for the agent with optional filters.")
	public ResponseEntity<PagedResponse<WithdrawalResponseDto>> generateCommissionWithdrawal(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "status", required = false) WithdrawalRequestStatus status,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		return new ResponseEntity<PagedResponse<WithdrawalResponseDto>>(withdrawalService
				.getCommissionWithdrawalsWithFilters(page, size, sortBy, direction, status, fromDate, toDate),
				HttpStatus.OK);
	}

	@GetMapping("/commissions")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Agent Commissions", description = "Retrieve all commissions for the agent with optional filters such as date range, commission type, and amount.")
	public ResponseEntity<PagedResponse<CommissionResponseDto>> getAllCommissions(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "commissionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "agentId", required = false) Long agentId,
			@RequestParam(name = "commissionType", required = false) CommissionType commissionType,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate from,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate to) {

		PagedResponse<CommissionResponseDto> commissions = commissionService.getCommissionsWithFilters(page, size,
				sortBy, direction, commissionType, from, to); 

		return new ResponseEntity<>(commissions, HttpStatus.OK);
	}

	@GetMapping("/customers")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Customers by Agent", description = "Retrieve all customers associated with the agent, with pagination, sorting, and optional filters.")
	public ResponseEntity<PagedResponse<CustomerResponseDto>> getAllCustomerByAgent(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "name", required = false) String name,
			@RequestParam(name = "city", required = false) String city,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "isActive", required = false) Boolean isActive) {
		return new ResponseEntity<>(customerManagementService.getAllCustomersByAgentWithFilters(page, size, sortBy,
				direction, name, city, state, isActive), HttpStatus.OK);
	}

	@GetMapping("/policies")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Policies by Agent", description = "Retrieve all policies associated with the agent, with pagination and filtering options.")
	public ResponseEntity<PagedResponse<PolicyAccountResponseDto>> getAllPoliciesByAgent(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyNo") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "policyNumber", required = false) Long policyNumber,
			@RequestParam(name = "premiumType", required = false) String premiumType,
			@RequestParam(name = "status", required = false) String status) {

		PagedResponse<PolicyAccountResponseDto> response = policyService.getAllPoliciesByAgentWithFilters(page, size,
				sortBy, direction, policyNumber, premiumType, status);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/policies/payments")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Policy Payments by Agent", description = "Retrieve payments for the agent's policies, with optional filters for date range.")
	public ResponseEntity<PagedResponse<PaymentResponseDto>> getAgentPolicyPayments(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "paymentDate") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
		LocalDateTime toDateTime = toDate != null ? toDate.atTime(23, 59, 59) : null;

		PagedResponse<PaymentResponseDto> response = paymentService.getPaymentsByAgentWithPagination(page, size, sortBy,
				direction, fromDateTime, toDateTime);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/policies/claims")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Policy Claims by Agent", description = "Retrieve claims associated with the agent's policies, with pagination and sorting options.")
	public ResponseEntity<PagedResponse<ClaimResponseDto>> getAgentPolicyClaims(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "claimDate") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction) {

		PagedResponse<ClaimResponseDto> response = claimService.getAgentClaims(page, size, sortBy, direction);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/profile")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Agent Profile", description = "Retrieve the profile details of the currently logged-in agent.")
	public ResponseEntity<AgentResponseDto> getAgentProfile() {
		return new ResponseEntity<AgentResponseDto>(agentManagementService.getAgentProfile(), HttpStatus.OK);
	}

	@GetMapping("/plans/{planId}/schemes")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Schemes by Plan ID", description = "Retrieve all insurance schemes associated with a specific plan ID.")
	public ResponseEntity<List<InsuranceSchemeResponseDto>> getSchemesByPlanId(@PathVariable Long planId) {

		List<InsuranceSchemeResponseDto> schemes = insuranceManagementService.getSchemesByPlanId(planId);

		return ResponseEntity.ok(schemes);
	}

	@PostMapping("/send-recommendation-email")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Send Recommendation Email", description = "Send a referral recommendation email on behalf of the agent.")
	public ResponseEntity<String> sendRecommendation(@RequestBody ReferralEmailRequestDto referralEmailRequestDto) {
		return new ResponseEntity<String>(agentManagementService.sendRecommendationEmail(referralEmailRequestDto),
				HttpStatus.OK);

	}

	@GetMapping("/total-commission")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Get Total Commission", description = "Retrieve the total commission earned by the currently logged-in agent.")
	public ResponseEntity<Double> getTotalCommission() {
		return new ResponseEntity<Double>(agentManagementService.getTotalCommission(), HttpStatus.OK);
	}

	private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(DateTimeFormatter.ofPattern("yyyy-MM-dd"),
			DateTimeFormatter.ofPattern("dd-MM-yyyy"));

	private LocalDate parseDate(String dateStr) {
		for (DateTimeFormatter formatter : FORMATTERS) {
			try {
				return LocalDate.parse(dateStr, formatter);
			} catch (DateTimeParseException e) {
			}
		}
		return LocalDate.now();
	}
}
