package com.monocept.myapp.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.myapp.dto.InsurancePlanRequestDto;
import com.monocept.myapp.dto.InsurancePlanResponseDto;
import com.monocept.myapp.dto.InsuranceSchemeRequestDto;
import com.monocept.myapp.dto.InsuranceSchemeResponseDto;
import com.monocept.myapp.dto.InterestCalculatorRequestDto;
import com.monocept.myapp.dto.InterestCalculatorResponseDto;
import com.monocept.myapp.entity.InsuranceScheme;
import com.monocept.myapp.util.PagedResponse;

public interface InsuranceManagementService {

	String createInsurancePlan(InsurancePlanRequestDto insurancePlanRequestDto);

	String updateInsurancePlan(InsurancePlanRequestDto insurancePlanRequestDto);

	PagedResponse<InsurancePlanResponseDto> getAllInsurancePlans(int page, int size, String sortBy, String direction);

	String deactivateInsurancePlan(long insuranceTypeId);

	String createInsuranceScheme(long insurancePlanId, MultipartFile multipartFile,
			InsuranceSchemeRequestDto requestDto) throws IOException;

	List<InsuranceSchemeResponseDto> getAllInsuranceSchemes(long insurancePlanId);

	String updateInsuranceScheme(long insurancePlanId, InsuranceSchemeRequestDto requestDto) throws IOException;

	String deleteInsuranceScheme(long insurancePlanId, long insuranceSchemeId);

	InsuranceSchemeResponseDto getInsuranceById(long insurancePlanId);

	InterestCalculatorResponseDto calculateInterest(InterestCalculatorRequestDto interestCalculatorDto);

	String activateInsurancePlan(long insurancePlanId);

	PagedResponse<InsuranceSchemeResponseDto> getAllSchemesWithFilters(int page, int size, String sortBy,
			String direction, Double minAmount, Double maxAmount, Integer minPolicyTerm, Integer maxPolicyTerm,
			Long planId, String schemeName, Boolean active);

	Page<InsuranceSchemeResponseDto> getSchemesByPlanId(Long planId, int page, int size);

	InsuranceScheme getSchemeImageById(long schemeId);

	Long getPlanCount();

	List<InsuranceSchemeResponseDto> getSchemesByPlanId(Long planId);




}
