package com.monocept.myapp.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.myapp.dto.AdminResponseDto;
import com.monocept.myapp.dto.ClaimResponseDto;
import com.monocept.myapp.dto.CommissionResponseDto;
import com.monocept.myapp.dto.InsurancePlanRequestDto;
import com.monocept.myapp.dto.InsuranceSchemeRequestDto;
import com.monocept.myapp.dto.InsuranceSchemeResponseDto;
import com.monocept.myapp.dto.InsuranceSettingRequestDto;
import com.monocept.myapp.dto.TaxSettingRequestDto;
import com.monocept.myapp.dto.WithdrawalResponseDto;
import com.monocept.myapp.enums.ClaimStatus;
import com.monocept.myapp.enums.CommissionType;
import com.monocept.myapp.enums.DocumentType;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.service.AdminService;
import com.monocept.myapp.service.AgentManagementService;
import com.monocept.myapp.service.ClaimService;
import com.monocept.myapp.service.CommissionService;
import com.monocept.myapp.service.DashboardService;
import com.monocept.myapp.service.InsuranceManagementService;
import com.monocept.myapp.service.SettingService;
import com.monocept.myapp.service.WithdrawalService;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

//admin-controller
@RestController
@RequestMapping("/guardian-life-assurance")
public class AdminController {

	@Autowired
	private SettingService settingService;

	@Autowired
	private AgentManagementService agentManagementService;

	@Autowired
	private InsuranceManagementService insuranceManagementService;

	@Autowired
	private AdminService adminService;

	@Autowired
	private ClaimService claimService;

	@Autowired
	private WithdrawalService withdrawalService;

	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private CommissionService commissionService;
	
	

	@PutMapping("/withdrawals/{withdrawalId}/approval")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Approve a withdrawal request", description = "Approve a pending withdrawal request by its ID")
	public ResponseEntity<String> approveWithdrawalRequest(@PathVariable long withdrawalId) {
		withdrawalService.approveWithdrawal(withdrawalId);
		
		return ResponseEntity.ok("Withdrawal request approved and refund processed successfully.");
	}

	@PutMapping("/withdrawals/{withdrawalId}/rejection")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Reject a withdrawal request", description = "Reject a pending withdrawal request by its ID")
	public ResponseEntity<String> rejectWithdrawalRequest(@PathVariable long withdrawalId) {
		withdrawalService.rejectWithdrawal(withdrawalId);
		return ResponseEntity.ok("Withdrawal request rejected successfully.");
	}

	@GetMapping("/admins/profile")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get admin profile", description = "Retrieve the profile details of the currently logged-in admin")
	public ResponseEntity<AdminResponseDto> getAdminProfile() {
		return new ResponseEntity<>(adminService.getAdminByUsername(), HttpStatus.OK);
	}

	@PostMapping("/taxes")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create a new tax setting", description = "Add a new tax setting to the system")
	public ResponseEntity<String> createTaxSetting(@Valid @RequestBody TaxSettingRequestDto taxSettingRequestDto) {
		return new ResponseEntity<String>(settingService.createTaxSetting(taxSettingRequestDto), HttpStatus.CREATED);
	}

	@DeleteMapping("/agents/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Delete an agent", description = "Remove an agent from the system by their ID")
	public ResponseEntity<String> deleteAgent(@PathVariable(name = "id") long id) {
		return new ResponseEntity<String>(agentManagementService.deleteAgent(id), HttpStatus.OK);
	}

	@PostMapping("/insurance-plans")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create a new insurance plan", description = "Add a new insurance plan to the system")
	public ResponseEntity<String> createInsurancePlan(@Valid @RequestBody InsurancePlanRequestDto insurancePlanRequestDto) {
		return new ResponseEntity<>(insuranceManagementService.createInsurancePlan(insurancePlanRequestDto),
				HttpStatus.CREATED);
	}

	@PutMapping("/insurance-plans")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Update insurance plan details", description = "Update the details of an existing insurance plan")
	public ResponseEntity<String> updateInsurancePlan(@RequestBody InsurancePlanRequestDto insurancePlanRequestDto) {
		if (insurancePlanRequestDto.getPlanId() == null) {
			throw new InvalidDataAccessApiUsageException("The given id must not be null "
					+ insurancePlanRequestDto.getPlanId() + " " + insurancePlanRequestDto.getPlanName());
		}
		return new ResponseEntity<>(insuranceManagementService.updateInsurancePlan(insurancePlanRequestDto),
				HttpStatus.OK);
	}

	@DeleteMapping("/insurance-plans/{insurancePlanId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate an insurance plan", description = "Mark an insurance plan as inactive by its ID")
	public ResponseEntity<String> deactivateInsurancePlan(
			@PathVariable(name = "insurancePlanId") long insurancePlanId) {
		return new ResponseEntity<>(insuranceManagementService.deactivateInsurancePlan(insurancePlanId), HttpStatus.OK);
	}

	@PutMapping("/insurance-plans/{insurancePlanId}/activate")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Activate an insurance plan", description = "Mark an insurance plan as active by its ID")
	public ResponseEntity<String> activateInsurancePlan(@PathVariable(name = "insurancePlanId") long insurancePlanId) {
		return new ResponseEntity<>(insuranceManagementService.activateInsurancePlan(insurancePlanId), HttpStatus.OK);
	}

	@PostMapping("/insurance-plans/{insurancePlanId}/insurance-schemes")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create a new insurance scheme", description = "Add a new insurance scheme to an existing insurance plan")
	public ResponseEntity<String> createInsuranceScheme(@PathVariable(name = "insurancePlanId") long insurancePlanId,
			@RequestParam(name = "schemeImage") MultipartFile multipartFile,
			@ModelAttribute InsuranceSchemeRequestDto requestDto) throws IOException {
		return new ResponseEntity<String>(
				insuranceManagementService.createInsuranceScheme(insurancePlanId, multipartFile, requestDto),
				HttpStatus.CREATED);
	}

	@PutMapping("/insurance-plans/{insurancePlanId}/insurance-schemes")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Update insurance scheme details", description = "Update the details of an existing insurance scheme")
	public ResponseEntity<String> updateInsuranceScheme(@PathVariable(name = "insurancePlanId") long insurancePlanId,
			@RequestBody InsuranceSchemeRequestDto requestDto) throws IOException {
		if (requestDto.getSchemeId() == null) {
			throw new InvalidDataAccessApiUsageException("The given schemeId must not be null");
		}
		return new ResponseEntity<String>(insuranceManagementService.updateInsuranceScheme(insurancePlanId, requestDto),
				HttpStatus.OK);
	}

	@DeleteMapping("/insurance-plans/{insurancePlanId}/insurance-schemes/{insuranceSchemeId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate an insurance scheme", description = "Mark an insurance scheme as inactive by its ID")
	public ResponseEntity<String> deleteInsuranceScheme(@PathVariable(name = "insurancePlanId") long insurancePlanId,
			@PathVariable(name = "insuranceSchemeId") long insuranceSchemeId) {
		return new ResponseEntity<String>(
				insuranceManagementService.deleteInsuranceScheme(insurancePlanId, insuranceSchemeId), HttpStatus.OK);

	}

	@GetMapping("/insurance-schemes/{insuranceSchemeId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get insurance scheme by ID", description = "Retrieve a specific insurance scheme by its ID")
	public ResponseEntity<InsuranceSchemeResponseDto> getInsuranceSchemeById(
			@PathVariable(name = "insuranceSchemeId") long insuranceSchemeId) {
		return new ResponseEntity<InsuranceSchemeResponseDto>(
				insuranceManagementService.getInsuranceById(insuranceSchemeId), HttpStatus.OK);

	}

	@PostMapping("/insurance-settings")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create a new insurance setting", description = "Add a new insurance setting to the system")
	public ResponseEntity<String> createInsuranceSetting(
			@RequestBody InsuranceSettingRequestDto insuranceSettingRequestDto) {
		return new ResponseEntity<String>(settingService.createInsuranceSetting(insuranceSettingRequestDto),
				HttpStatus.CREATED);

	}

	@PutMapping("/claims/{claimId}/approval")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Approve a claim", description = "Approve an insurance claim by its ID")
	public ResponseEntity<String> approveClaim(@PathVariable Long claimId) {
		String response = claimService.approveClaim(claimId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/claims/{claimId}/rejection")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Reject a claim", description = "Reject an insurance claim by its ID")
	public ResponseEntity<String> rejectClaim(@PathVariable Long claimId) {
		String response = claimService.rejectClaim(claimId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/insurance-schemes")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get all insurance schemes with pagination, sorting, and filtering", description = "Retrieve all insurance schemes with pagination, sorting, and optional filters")
	public ResponseEntity<PagedResponse<InsuranceSchemeResponseDto>> getAllSchemes(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "100") int size,
			@RequestParam(name = "sortBy", defaultValue = "schemeName") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "minAmount", required = false) Double minAmount,
			@RequestParam(name = "maxAmount", required = false) Double maxAmount,
			@RequestParam(name = "minPolicyTerm", required = false) Integer minPolicyTerm,
			@RequestParam(name = "maxPolicyTerm", required = false) Integer maxPolicyTerm,
			@RequestParam(name = "planId", required = false) Long planId,
			@RequestParam(name = "schemeName", required = false) String schemeName,
			@RequestParam(name = "active", required = false) Boolean active) {

		PagedResponse<InsuranceSchemeResponseDto> schemes = insuranceManagementService.getAllSchemesWithFilters(page,
				size, sortBy, direction, minAmount, maxAmount, minPolicyTerm, maxPolicyTerm, planId, schemeName,
				active);

		return ResponseEntity.ok(schemes);
	}

	@GetMapping("/claims")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "View all claims", description = "Retrieve all claims with pagination, sorting, and optional filters")
	public ResponseEntity<PagedResponse<ClaimResponseDto>> getAllClaims(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(name = "sortBy", defaultValue = "claimId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "status", required = false) ClaimStatus status,
			@RequestParam(name = "customerId", required = false) Long customerId,
			@RequestParam(name = "policyNo", required = false) Long policyNo) {
		PagedResponse<ClaimResponseDto> claims = claimService.getAllClaimsWithFilters(page, size, sortBy, direction,
				status, customerId, policyNo);
		return new ResponseEntity<>(claims, HttpStatus.OK);
	}

	@GetMapping("/commission-withdrawals")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get All commission withdrawals", description = "Retrieve commission withdrawals with pagination, sorting, and optional filters")
	public ResponseEntity<PagedResponse<WithdrawalResponseDto>> generateCommissionWithdrawal(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "agentId", required = false) Long agentId,
			@RequestParam(name = "status", required = false) WithdrawalRequestStatus status,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		return new ResponseEntity<PagedResponse<WithdrawalResponseDto>>(withdrawalService
				.getCommissionWithdrawalsWithFilters(page, size, sortBy, direction, agentId, status, fromDate, toDate),
				HttpStatus.OK);
	}

	@GetMapping("/commissions")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get all commissions", description = "Retrieve a paginated list of all commissions with filters")
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
				sortBy, direction, agentId, commissionType, from, to);

		return new ResponseEntity<>(commissions, HttpStatus.OK);
	}

	@GetMapping("/commissions/types")
	@Operation(summary = "Get commission types", description = "Retrieve all available commission types")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	public ResponseEntity<List<CommissionType>> getCommissionTypes() {
		List<CommissionType> commissionTypes = Arrays.asList(CommissionType.values());
		return ResponseEntity.ok(commissionTypes);
	}

	@GetMapping("/commission-withdrawals/status")
	@Operation(summary = "Get withdrawal status types", description = "Retrieve all available withdrawal request statuses")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	public ResponseEntity<List<WithdrawalRequestStatus>> getWithdrawalTypes() {
		List<WithdrawalRequestStatus> commissionTypes = Arrays.asList(WithdrawalRequestStatus.values());
		return ResponseEntity.ok(commissionTypes);
	}

	@GetMapping("/documents-required")
	@Operation(summary = "Get required documents", description = "Retrieve a list of documents required for various operations")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	public ResponseEntity<List<DocumentType>> getDocumentsRequired() {
		List<DocumentType> documentTypes = Arrays.asList(DocumentType.values());
		return ResponseEntity.ok(documentTypes);
	}

	@GetMapping("/counts")
	@Operation(summary = "Get admin dashboard counts", description = "Retrieve various counts for the admin dashboard")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Map<String, Long>> getAdminDashboardCounts() {
		return new ResponseEntity<Map<String, Long>>(dashboardService.getAdminDashboardCount(), HttpStatus.OK);
	}

	@GetMapping("admins/details")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Get Current Admin Details", description = "Retrieve details of the currently logged-in admin.")
	public ResponseEntity<Map<String, Object>> getAdminDetails() {
		String currentUserEmail = getCurrentUserEmail();
		Map<String, Object> userDetails = adminService.getUserByEmail(currentUserEmail);
		return new ResponseEntity<>(userDetails, HttpStatus.OK);
	}

	private String getCurrentUserEmail() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			return ((UserDetails) authentication.getPrincipal()).getUsername();
		}
		return null;
	}

}
