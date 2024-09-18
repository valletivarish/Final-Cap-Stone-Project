package com.monocept.myapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.CityRequestDto;
import com.monocept.myapp.dto.CityResponseDto;
import com.monocept.myapp.dto.StateRequestDto;
import com.monocept.myapp.dto.StateResponseDto;
import com.monocept.myapp.entity.City;
import com.monocept.myapp.entity.State;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException.ResourceAlreadyDeactivatedException;
import com.monocept.myapp.repository.CityRepository;
import com.monocept.myapp.repository.StateRepository;
import com.monocept.myapp.util.PagedResponse;

@Service
public class StateAndCityManagementServiceImpl implements StateAndCityManagementService {

	@Autowired
	private StateRepository stateRepository;
	@Autowired
	private CityRepository cityRepository;

	@Override
	public String createState(StateRequestDto stateRequestDto) {
		State state = convertStateRequestDtoToState(stateRequestDto);
		stateRepository.save(state);
		return "State "+state.getName()+" has been successfully created.";
	}

	private State convertStateRequestDtoToState(StateRequestDto stateRequestDto) {
		State state = new State();
		state.setStateId(stateRequestDto.getId());
		state.setName(stateRequestDto.getName());
		state.setActive(true);
		return state;
	}

	private StateResponseDto convertStateToStateResponseDto(State state) {
		StateResponseDto stateResponseDto = new StateResponseDto();
		stateResponseDto.setId(state.getStateId());
		stateResponseDto.setName(state.getName());
		stateResponseDto.setActive(state.isActive());
		if (state.getCity() != null) {
			stateResponseDto.setCities(state.getCity().stream().map(city -> convertCityToCityResponseDto(city))
					.collect(Collectors.toList()));
		}
		return stateResponseDto;
	}

	private CityResponseDto convertCityToCityResponseDto(City city) {
		CityResponseDto cityResponseDto = new CityResponseDto();
		if (city.getCityId() != null) {
			cityResponseDto.setId(city.getCityId());
		}
		cityResponseDto.setCity(city.getName());
		cityResponseDto.setActive(city.isActive());
		return cityResponseDto;
	}

	@Override
	public String updateState(StateRequestDto stateRequestDto) {
		State existingState = stateRepository.findById(stateRequestDto.getId())
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a state with ID: " + stateRequestDto.getId()));
		if (stateRequestDto.getName() != null && stateRequestDto.getName() != "") {
			existingState.setName(stateRequestDto.getName());
		}
		stateRepository.save(existingState);
	    return "State with ID: " + stateRequestDto.getId() + " has been successfully updated.";
	}

	@Override
	public String deactivateState(long id) {
		State existingState = stateRepository.findById(id)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a state with ID: " + id));
		if (!existingState.isActive()) {
			throw new ResourceAlreadyDeactivatedException(
					"State '" + existingState.getName() + "' is already deactivated.");
		}
		existingState.setActive(false);
		stateRepository.save(existingState);
		return "State '" + existingState.getName() + "' has been successfully deactivated.";
	}

	@Override
	public StateResponseDto getStateById(long id) {
		State existingState = stateRepository.findById(id)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a state with ID: " + id));
		return convertStateToStateResponseDto(existingState);
	}

	@Override
	public PagedResponse<StateResponseDto> getAllStates(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
				: Sort.by(sortBy).ascending();
		PageRequest pageable = PageRequest.of(page, size, sort);

		Page<State> statePage = stateRepository.findAll(pageable);

		List<StateResponseDto> stateResponseDtos = statePage.getContent().stream()
				.map(state -> convertStateToStateResponseDto(state)).collect(Collectors.toList());

		return new PagedResponse<StateResponseDto>(stateResponseDtos, statePage.getNumber(), statePage.getSize(),
				statePage.getTotalElements(), statePage.getTotalPages(), statePage.isLast());
	}

	@Override
	public String createCity(long stateId, CityRequestDto cityRequestDto) {
		State state = stateRepository.findById(stateId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a state with ID: " + stateId));
		City city = convertCityRequestDtoToCity(cityRequestDto);
		if (!state.isActive()) {
			throw new GuardianLifeAssuranceException.ResourceNotActiveException(
					"State '" + state.getName() + "' is not active.");
		}
		city.setState(state);
		City createdCity = cityRepository.save(city);
		CityResponseDto responseDto = convertCityToCityResponseDto(createdCity);
		responseDto.setState(state.getName());
	    return "City '" + city.getName() + "' has been successfully created under the state '" + state.getName() + "'.";

	}

	private City convertCityRequestDtoToCity(CityRequestDto cityRequestDto) {
		City city = new City();
		city.setName(cityRequestDto.getName());
		city.setActive(cityRequestDto.isActive());
		return city;
	}

	@Override
	public List<CityResponseDto> getAllCitiesByStateId(long stateId) {
		State state = stateRepository.findById(stateId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a state with ID: " + stateId));
		List<CityResponseDto> cities = state.getCity().stream().map(c -> convertCityToCityResponseDto(c))
				.collect(Collectors.toList());

		return cities;
	}

	@Override
	public CityResponseDto updateCity(Long stateId, CityRequestDto cityRequestDto) {
	    State state = stateRepository.findById(stateId)
	            .orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
	                    "Sorry, we couldn't find a state with ID: " + stateId));

	    City existingCity = cityRepository.findById(cityRequestDto.getId())
	            .orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
	                    "Sorry, we couldn't find a city with ID: " + cityRequestDto.getId()));

	    if (cityRequestDto.getName() != null && !cityRequestDto.getName().isEmpty()) {
	        existingCity.setName(cityRequestDto.getName());
	    }

	    existingCity.setActive(cityRequestDto.isActive());

	    City updatedCity = cityRepository.save(existingCity);

	    CityResponseDto responseDto = convertCityToCityResponseDto(updatedCity);
	    responseDto.setState(state.getName());

	    return responseDto;
	}


	@Override
	public String deactivateCity(Long cityId) {
		City existingCity = cityRepository.findById(cityId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a city with ID: " + cityId));

		if (!existingCity.isActive()) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.CONFLICT,
					"City '" + existingCity.getName() + "' is already deactivated.");
		}
		existingCity.setActive(false);
		cityRepository.save(existingCity);
		return "City '" + existingCity.getName() + "' has been successfully deactivated.";
	}

	@Override
	public CityResponseDto getCityById(Long cityId) {
		City city = cityRepository.findById(cityId)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
						"Sorry, we couldn't find a city with ID: " + cityId));
		CityResponseDto responseDto = convertCityToCityResponseDto(city);
		responseDto.setCity(city.getState().getName());
		return responseDto;
	}

	@Override
	public String activateStateById(long id) {
		State state = stateRepository.findById(id)
				.orElseThrow(() -> new GuardianLifeAssuranceException.ResourceNotFoundException(
	                    "Sorry, we couldn't find a state with ID: " + id));
		if(state.isActive()) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.CONFLICT, 
		            "State '" + state.getName() + "' is already activated.");
		}
		state.setActive(true);
		stateRepository.save(state);
		return "State '" + state.getName() + "' has been successfully activated.";
	}

	@Override
	public String activateCityById(long cityId) {
		City city = cityRepository.findById(cityId).orElseThrow();


	    if (city.isActive()) {
	        throw new GuardianLifeAssuranceApiException(HttpStatus.CONFLICT, 
	                "City '" + city.getName() + "' is already activated.");
	    }

	    city.setActive(true);

	    cityRepository.save(city);

	    return "City '" + city.getName() + "' has been successfully activated.";
	}

	@Override
	public Long getCount() {
		return stateRepository.count();
	}


	

}
