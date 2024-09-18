package com.monocept.myapp.service;

import com.monocept.myapp.dto.InsuranceSettingRequestDto;
import com.monocept.myapp.dto.InsuranceSettingResponseDto;
import com.monocept.myapp.dto.TaxSettingRequestDto;
import com.monocept.myapp.dto.TaxSettingResponseDto;

public interface SettingService {

	String createTaxSetting(TaxSettingRequestDto taxSettingRequestDto);

	String createInsuranceSetting(InsuranceSettingRequestDto insuranceSettingRequestDto);

	InsuranceSettingResponseDto getInsuranceSetting();

	TaxSettingResponseDto getTaxSetting();

}
