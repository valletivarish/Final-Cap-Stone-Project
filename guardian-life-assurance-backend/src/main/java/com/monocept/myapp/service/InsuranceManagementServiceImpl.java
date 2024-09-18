package com.monocept.myapp.service;

import java.io.IOException;
import java.util.Base64;
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
import org.springframework.web.multipart.MultipartFile;

import com.monocept.myapp.dto.InsurancePlanRequestDto;
import com.monocept.myapp.dto.InsurancePlanResponseDto;
import com.monocept.myapp.dto.InsuranceSchemeRequestDto;
import com.monocept.myapp.dto.InsuranceSchemeResponseDto;
import com.monocept.myapp.dto.InterestCalculatorRequestDto;
import com.monocept.myapp.dto.InterestCalculatorResponseDto;
import com.monocept.myapp.dto.ReferralEmailRequestDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.InsurancePlan;
import com.monocept.myapp.entity.InsuranceScheme;
import com.monocept.myapp.entity.TaxSetting;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.repository.InsurancePlanRepository;
import com.monocept.myapp.repository.InsuranceSchemeRepository;
import com.monocept.myapp.repository.TaxSettingRepository;
import com.monocept.myapp.util.ImageUtil;
import com.monocept.myapp.util.PagedResponse;

@Service
public class InsuranceManagementServiceImpl implements InsuranceManagementService {

	@Autowired
	private InsurancePlanRepository insurancePlanRepository;

	@Autowired
	private InsuranceSchemeRepository insuranceSchemeRepository;
	@Autowired
	private TaxSettingRepository taxSettingRepository;

	@Override
	public String createInsurancePlan(InsurancePlanRequestDto insurancePlanRequestDto) {
		InsurancePlan insurancePlan = new InsurancePlan();
		insurancePlan.setPlanId(insurancePlanRequestDto.getPlanId());
		insurancePlan.setPlanName(insurancePlanRequestDto.getPlanName());
		insurancePlan.setActive(insurancePlanRequestDto.isActive());
		insurancePlanRepository.save(insurancePlan);
		return "Insurance Plan '" + insurancePlan.getPlanName() + "' has been successfully created.";
	}

	@Override
	public String updateInsurancePlan(InsurancePlanRequestDto insurancePlanRequestDto) {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanRequestDto.getPlanId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanRequestDto.getPlanId()));
		insurancePlan.setPlanName(insurancePlanRequestDto.getPlanName());
		insurancePlan.setActive(insurancePlanRequestDto.isActive());
		insurancePlanRepository.save(insurancePlan);
		return "Insurance Plan '" + insurancePlan.getPlanName() + "' has been successfully updated.";
	}

	@Override
	public PagedResponse<InsurancePlanResponseDto> getAllInsurancePlans(int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();
		PageRequest pageRequest = PageRequest.of(page, size, sort);
		Page<InsurancePlan> insurancePlanPage = insurancePlanRepository.findAll(pageRequest);

		List<InsurancePlanResponseDto> list = insurancePlanPage.getContent().stream()
				.map(insuranceType -> convertInsuranceToInsuranceResponseDto(insuranceType))
				.collect(Collectors.toList());
		return new PagedResponse<>(list, insurancePlanPage.getNumber(), insurancePlanPage.getSize(),
				insurancePlanPage.getTotalElements(), insurancePlanPage.getTotalPages(), insurancePlanPage.isLast());
	}

	private InsurancePlanResponseDto convertInsuranceToInsuranceResponseDto(InsurancePlan insurancePlan) {
		InsurancePlanResponseDto insuranceResponseDto = new InsurancePlanResponseDto();
		insuranceResponseDto.setPlanId(insurancePlan.getPlanId());
		insuranceResponseDto.setPlanName(insurancePlan.getPlanName());
		insuranceResponseDto.setActive(insurancePlan.isActive());
		return insuranceResponseDto;
	}

	@Override
	public String deactivateInsurancePlan(long insurancePlanId) {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		insurancePlan.setActive(false);
		insurancePlanRepository.save(insurancePlan);
		return "Insurance Plan '" + insurancePlan.getPlanName() + "' has been successfully deactivated.";
	}

	@Override
	public String createInsuranceScheme(long insurancePlanId, MultipartFile multipartFile,
			InsuranceSchemeRequestDto requestDto) throws IOException {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		InsuranceScheme insuranceScheme = new InsuranceScheme();
		insuranceScheme.setSchemeImage(ImageUtil.compressFile(multipartFile.getBytes()));
		insuranceScheme.setDescription(requestDto.getDetailDescription());
		insuranceScheme.setInstallmentCommRatio(requestDto.getInstallmentCommRatio());
		insuranceScheme.setMaxAge(requestDto.getMaxAge());
		insuranceScheme.setMaxAmount(requestDto.getMaxAmount());
		insuranceScheme.setMaxPolicyTerm(requestDto.getMaxPolicyTerm());
		insuranceScheme.setMinAge(requestDto.getMinAge());
		insuranceScheme.setMinAmount(requestDto.getMinAmount());
		insuranceScheme.setMinPolicyTerm(requestDto.getMinPolicyTerm());
		insuranceScheme.setProfitRatio(requestDto.getProfitRatio());
		insuranceScheme.setRegistrationCommRatio(requestDto.getRegistrationCommRatio());
		insuranceScheme.setActive(true);
		insuranceScheme.setSchemeName(requestDto.getSchemeName());
		insuranceScheme.setInsurancePlan(insurancePlan);
		
		insuranceScheme.setRequiredDocuments(requestDto.getRequiredDocuments());
		insuranceSchemeRepository.save(insuranceScheme);
		List<InsuranceScheme> schemes = insurancePlan.getScheme();
		schemes.add(insuranceScheme);
		insurancePlan.setScheme(schemes);
		insurancePlanRepository.save(insurancePlan);

		return "Insurance Scheme Added Successfully";
	}

	@Override
	public List<InsuranceSchemeResponseDto> getAllInsuranceSchemes(long insurancePlanId) {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		List<InsuranceSchemeResponseDto> schemes = insurancePlan.getScheme().stream()
				.map(scheme -> convertSchemeToSchemeResponseDto(scheme)).collect(Collectors.toList());
		return schemes;
	}

	private InsuranceSchemeResponseDto convertSchemeToSchemeResponseDto(InsuranceScheme scheme) {
		InsuranceSchemeResponseDto schemeResponseDto = new InsuranceSchemeResponseDto();
		schemeResponseDto.setActive(scheme.isActive());
		schemeResponseDto.setSchemeId(scheme.getSchemeId());
		schemeResponseDto.setDetailDescription(scheme.getDescription());
		schemeResponseDto.setInstallmentCommRatio(scheme.getInstallmentCommRatio());
		schemeResponseDto.setMaxAge(scheme.getMaxAge());
		schemeResponseDto.setMaxAmount(scheme.getMaxAmount());
		schemeResponseDto.setMaxPolicyTerm(scheme.getMaxPolicyTerm());
		schemeResponseDto.setMinAge(scheme.getMinAge());
		schemeResponseDto.setMinAmount(scheme.getMinAmount());
		schemeResponseDto.setMinPolicyTerm(scheme.getMinPolicyTerm());
		schemeResponseDto.setProfitRatio(scheme.getProfitRatio());
		schemeResponseDto.setRegistrationCommRatio(scheme.getRegistrationCommRatio());
		schemeResponseDto.setSchemeName(scheme.getSchemeName());
		return schemeResponseDto;
	}

	@Override
	public String updateInsuranceScheme(long insurancePlanId,
			InsuranceSchemeRequestDto requestDto) throws IOException {
		insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		InsuranceScheme insuranceScheme = insuranceSchemeRepository.findById(requestDto.getSchemeId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Scheme with ID: " + requestDto.getSchemeId()));
		insuranceScheme.setDescription(requestDto.getDetailDescription());
		insuranceScheme.setInstallmentCommRatio(requestDto.getInstallmentCommRatio());
		insuranceScheme.setMaxAge(requestDto.getMaxAge());
		insuranceScheme.setMaxAmount(requestDto.getMaxAmount());
		insuranceScheme.setMaxPolicyTerm(requestDto.getMaxPolicyTerm());
		insuranceScheme.setMinAge(requestDto.getMinAge());
		insuranceScheme.setMinAmount(requestDto.getMinAmount());
		insuranceScheme.setMinPolicyTerm(requestDto.getMinPolicyTerm());
		insuranceScheme.setProfitRatio(requestDto.getProfitRatio());
		insuranceScheme.setRegistrationCommRatio(requestDto.getRegistrationCommRatio());
		insuranceScheme.setActive(requestDto.isActive());
		insuranceScheme.setSchemeName(requestDto.getSchemeName());
		insuranceSchemeRepository.save(insuranceScheme);

		return "Insurance Scheme '" + insuranceScheme.getSchemeName() + "' has been successfully updated.";
	}

	@Override
	public String deleteInsuranceScheme(long insurancePlanId, long insuranceSchemeId) {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		InsuranceScheme schemeToDelete = insurancePlan.getScheme().stream()
				.filter(scheme -> scheme.getSchemeId().equals(insuranceSchemeId)).findFirst()
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Scheme with ID: " + insuranceSchemeId));
		schemeToDelete.setActive(false);
		insuranceSchemeRepository.save(schemeToDelete);

		return "Insurance Scheme '" + schemeToDelete.getSchemeName() + "' has been successfully deactivated.";
	}

	@Override
	public InsuranceSchemeResponseDto getInsuranceById(long insuranceSchemeId) {
		InsuranceScheme insuranceScheme = insuranceSchemeRepository.findById(insuranceSchemeId).orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
				"Sorry, we couldn't find an Insurance Scheme with ID: " + insuranceSchemeId));
				
		return convertToDto(insuranceScheme);
	}
	
	

	@Override
	public InterestCalculatorResponseDto calculateInterest(InterestCalculatorRequestDto interestCalculatorDto) {

	    InsuranceScheme insuranceScheme = insuranceSchemeRepository.findById(interestCalculatorDto.getSchemeId())
	            .orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
	                    "Sorry, we couldn't find an Insurance Scheme with ID: " + interestCalculatorDto.getSchemeId()));

	    validateInvestmentAmount(interestCalculatorDto.getInvestAmount(), insuranceScheme);
	    validatePolicyTerm(interestCalculatorDto.getYears(), insuranceScheme);

	    InterestCalculatorResponseDto responseDto = new InterestCalculatorResponseDto();

	    TaxSetting taxSetting = taxSettingRepository.findTopByOrderByUpdatedAtDesc();
	    double taxPercentage = taxSetting.getTaxPercentage();

	    long totalInstallments = calculateTotalInstallments(interestCalculatorDto.getYears(),
	            interestCalculatorDto.getMonths());
	    responseDto.setNoOfInstallments(totalInstallments);

	    double baseInstallmentAmount = interestCalculatorDto.getInvestAmount() / totalInstallments;

	    double installmentAmountWithTax = baseInstallmentAmount + (baseInstallmentAmount * taxPercentage / 100);
	    responseDto.setInstallmentAmount(installmentAmountWithTax);

	    double interestAmount = calculateInterestAmount(interestCalculatorDto.getInvestAmount(),
	            insuranceScheme.getProfitRatio());
	    responseDto.setInterestAmount(interestAmount);

	    double assuredAmount = interestCalculatorDto.getInvestAmount() + interestAmount;
	    responseDto.setAssuredAmount(assuredAmount);

	    return responseDto;
	}

	private void validateInvestmentAmount(double investAmount, InsuranceScheme schemeDetail) {
		if (investAmount > schemeDetail.getMaxAmount() || investAmount < schemeDetail.getMinAmount()) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Investment Amount should be between "
					+ schemeDetail.getMinAmount() + " and " + schemeDetail.getMaxAmount());
		}
	}

	private void validatePolicyTerm(int years, InsuranceScheme schemeDetail) {
		if (years > schemeDetail.getMaxPolicyTerm() || years < schemeDetail.getMinPolicyTerm()) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Policy term should be between "
					+ schemeDetail.getMinPolicyTerm() + " and " + schemeDetail.getMaxPolicyTerm() + " years.");
		}
	}

	private long calculateTotalInstallments(int years, int months) {
		switch (months) {
		case 12:
			return years;
		case 6:
			return years * 2;
		case 3:
			return years * 4;
		default:
			return years * 12;
		}
	}

	private double calculateInterestAmount(double investAmount, double profitRatio) {
		return (profitRatio / 100) * investAmount;
	}

	@Override
	public String activateInsurancePlan(long insurancePlanId) {
		InsurancePlan insurancePlan = insurancePlanRepository.findById(insurancePlanId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find an Insurance Plan with ID: " + insurancePlanId));
		insurancePlan.setActive(true);
		insurancePlanRepository.save(insurancePlan);
		return "Insurance Plan '" + insurancePlan.getPlanName() + "' has been successfully activated.";
	}

	public PagedResponse<InsuranceSchemeResponseDto> getAllSchemesWithFilters(int page, int size, String sortBy,
            String direction, Double minAmount, Double maxAmount, Integer minPolicyTerm, Integer maxPolicyTerm,
            Long planId, String schemeName, Boolean active) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));

        Page<InsuranceScheme> schemesPage = insuranceSchemeRepository.findByFilters(minAmount, maxAmount, minPolicyTerm,
                maxPolicyTerm, planId, schemeName, active, pageable);

        List<InsuranceSchemeResponseDto> content = schemesPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, schemesPage.getNumber(), schemesPage.getSize(),
                schemesPage.getTotalElements(), schemesPage.getTotalPages(), schemesPage.isLast());
    }

    private InsuranceSchemeResponseDto convertToDto(InsuranceScheme scheme) {
        InsuranceSchemeResponseDto dto = new InsuranceSchemeResponseDto();
        dto.setPlanId(scheme.getInsurancePlan().getPlanId());
        dto.setSchemeId(scheme.getSchemeId());
        dto.setPlanName(scheme.getInsurancePlan().getPlanName());
        dto.setSchemeName(scheme.getSchemeName());
        dto.setActive(scheme.isActive());
        dto.setDetailDescription(scheme.getDescription());
        dto.setMinAmount(scheme.getMinAmount());
        dto.setMaxAmount(scheme.getMaxAmount());
        dto.setMinPolicyTerm(scheme.getMinPolicyTerm());
        dto.setMaxPolicyTerm(scheme.getMaxPolicyTerm());
        dto.setMinAge(scheme.getMinAge());
        dto.setMaxAge(scheme.getMaxAge());
        dto.setProfitRatio(scheme.getProfitRatio());
        dto.setRegistrationCommRatio(scheme.getRegistrationCommRatio());
        dto.setInstallmentCommRatio(scheme.getInstallmentCommRatio());
        if (scheme.getSchemeImage() != null) {
            String base64Image = Base64.getEncoder().encodeToString(ImageUtil.decompressFile(scheme.getSchemeImage()));
            dto.setImage(base64Image);
        } else {
            dto.setImage(null); 
        }
        return dto;
    }

    public Page<InsuranceSchemeResponseDto> getSchemesByPlanId(Long planId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InsuranceScheme> schemePage = insuranceSchemeRepository.findByInsurancePlan_PlanId(planId, pageable);

        return schemePage.map(this::convertToDto);
    }

	@Override
	public InsuranceScheme getSchemeImageById(long schemeId) {
		return insuranceSchemeRepository.findById(schemeId).orElse(null);
	}

	@Override
	public Long getPlanCount() {
		return insurancePlanRepository.count();
	}

	@Override
	public List<InsuranceSchemeResponseDto> getSchemesByPlanId(Long planId) {
		List<InsuranceScheme> schemes = insuranceSchemeRepository.findByInsurancePlan_PlanId(planId);
		return schemes.stream().map(scheme->convertSchemeToSchemeResponseDto(scheme)).collect(Collectors.toList());
	}


	
	
}
