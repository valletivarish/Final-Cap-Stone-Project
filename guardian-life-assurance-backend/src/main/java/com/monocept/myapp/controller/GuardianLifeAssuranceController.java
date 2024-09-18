package com.monocept.myapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.myapp.dto.InsurancePlanResponseDto;
import com.monocept.myapp.dto.StateResponseDto;
import com.monocept.myapp.service.InsuranceManagementService;
import com.monocept.myapp.service.StateAndCityManagementService;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/guardian-life-assurance")
public class GuardianLifeAssuranceController {

	@Autowired
	private InsuranceManagementService insuranceManagementService;

	@Autowired
	private StateAndCityManagementService stateAndCityManagementService;

	@GetMapping("/insurance-plans")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	@Operation(summary = "Get All Insurance Plans", description = "Retrieve a paginated list of all insurance plans.")
	public ResponseEntity<PagedResponse<InsurancePlanResponseDto>> getAllInsurancePlans(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "planId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
		return new ResponseEntity<>(insuranceManagementService.getAllInsurancePlans(page, size, sortBy, direction),
				HttpStatus.OK);
	}

	@GetMapping("states")
	@Operation(summary = "Get All States", description = "Retrieve a paginated list of all states.")
	public ResponseEntity<PagedResponse<StateResponseDto>> getAllStates(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
		return new ResponseEntity<PagedResponse<StateResponseDto>>(
				stateAndCityManagementService.getAllStates(page, size, sortBy, direction), HttpStatus.OK);

	}

	@GetMapping("states/count")
	@Operation(summary = "Get State Count", description = "Retrieve the total count of states.")
	public ResponseEntity<Long> getStateCount() {
		return new ResponseEntity<Long>(stateAndCityManagementService.getCount(), HttpStatus.OK);
	}

	@GetMapping("/insurance-plans/count")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER') or hasRole('AGENT')")
	@Operation(summary = "Get Insurance Plans Count", description = "Retrieve the total count of insurance plans.")
	public ResponseEntity<Long> getPlanCount() {
		return new ResponseEntity<Long>(insuranceManagementService.getPlanCount(), HttpStatus.OK);
	}

}
