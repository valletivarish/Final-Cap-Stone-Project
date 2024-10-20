package com.monocept.myapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.InsuranceSettingRequestDto;
import com.monocept.myapp.dto.InsuranceSettingResponseDto;
import com.monocept.myapp.dto.TaxSettingRequestDto;
import com.monocept.myapp.dto.TaxSettingResponseDto;
import com.monocept.myapp.entity.InsuranceSetting;
import com.monocept.myapp.entity.TaxSetting;
import com.monocept.myapp.repository.InsuranceSettingRepository;
import com.monocept.myapp.repository.TaxSettingRepository;

@Service
public class SettingServiceImpl implements SettingService {

	@Autowired
	private TaxSettingRepository taxSettingRepository;

	@Autowired
	private InsuranceSettingRepository insuranceSettingRepository;

	@Override
	public String createTaxSetting(TaxSettingRequestDto taxSettingRequestDto) {
		TaxSetting taxSetting = new TaxSetting();
		taxSetting.setTaxPercentage(taxSettingRequestDto.getTaxPercentage());
		taxSetting.setUpdatedAt(taxSettingRequestDto.getUpdatedAt());
		taxSettingRepository.save(taxSetting);
		return "Tax Setting updated";
	}

	@Override
	public String createInsuranceSetting(InsuranceSettingRequestDto insuranceSettingRequestDto) {
		InsuranceSetting insuranceSetting = new InsuranceSetting();
		insuranceSetting.setClaimDeductionPercentage(insuranceSettingRequestDto.getClaimDeduction());
		insuranceSetting.setPenaltyDeductionPercentage(insuranceSettingRequestDto.getPenaltyAmount());
		insuranceSettingRepository.save(insuranceSetting);
		return "Insurance Setting updated";
	}

	@Override
	public InsuranceSettingResponseDto getInsuranceSetting() {
		InsuranceSettingResponseDto insuranceSettingResponseDto = new InsuranceSettingResponseDto();
		InsuranceSetting insuranceSetting = insuranceSettingRepository.findTopByOrderByUpdatedAtDesc();
		insuranceSettingResponseDto.setClaimDeduction(insuranceSetting.getClaimDeductionPercentage());
		insuranceSettingResponseDto.setPenaltyAmount(insuranceSetting.getPenaltyDeductionPercentage());
		return insuranceSettingResponseDto;
	}

	@Override
	public TaxSettingResponseDto getTaxSetting() {
		TaxSettingResponseDto taxSettingResponseDto = new TaxSettingResponseDto();
		TaxSetting updatedAtDesc = taxSettingRepository.findTopByOrderByUpdatedAtDesc();
		taxSettingResponseDto.setTaxPercentage(updatedAtDesc.getTaxPercentage());
		return taxSettingResponseDto;
	}

}
