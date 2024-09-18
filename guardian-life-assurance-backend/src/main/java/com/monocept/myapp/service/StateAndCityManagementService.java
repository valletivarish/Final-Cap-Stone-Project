package com.monocept.myapp.service;

import java.util.List;

import com.monocept.myapp.dto.CityRequestDto;
import com.monocept.myapp.dto.CityResponseDto;
import com.monocept.myapp.dto.StateRequestDto;
import com.monocept.myapp.dto.StateResponseDto;
import com.monocept.myapp.util.PagedResponse;

public interface StateAndCityManagementService {
	
	String createState(StateRequestDto stateRequestDto);

	String updateState(StateRequestDto stateRequestDto);

	String deactivateState(long id);

	StateResponseDto getStateById(long id);

	PagedResponse<StateResponseDto> getAllStates(int page, int size, String sortBy, String direction);

	String createCity(long stateId, CityRequestDto cityRequestDto);

	List<CityResponseDto> getAllCitiesByStateId(long stateId);

	CityResponseDto updateCity(Long stateId, CityRequestDto cityRequestDto);

	String deactivateCity(Long cityId);

	CityResponseDto getCityById(Long cityId);

	String activateStateById(long id);

	String activateCityById(long id);

	Long getCount();

}
