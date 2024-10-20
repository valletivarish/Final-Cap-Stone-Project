package com.monocept.myapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.myapp.dto.CityRequestDto;
import com.monocept.myapp.dto.CityResponseDto;
import com.monocept.myapp.dto.StateRequestDto;
import com.monocept.myapp.dto.StateResponseDto;
import com.monocept.myapp.service.StateAndCityManagementService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("guardian-life-assurance")
@CrossOrigin(origins = "http://localhost:3000")
public class StateCityController {

	@Autowired
	private StateAndCityManagementService stateAndCityManagementService;

	@PostMapping("/states")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Create a new state", description = "Add a new state to the system")
	public ResponseEntity<String> createState(@RequestBody StateRequestDto stateRequestDto) {
		return new ResponseEntity<String>(stateAndCityManagementService.createState(stateRequestDto),
				HttpStatus.ACCEPTED);
	}

	@PutMapping("/states")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Update state details", description = "Update the details of an existing state")
	public ResponseEntity<String> updateState(@RequestBody StateRequestDto stateRequestDto) {
		return new ResponseEntity<String>(stateAndCityManagementService.updateState(stateRequestDto),
				HttpStatus.OK);
	}

	@DeleteMapping("/states/{stateId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate a state", description = "Mark a state as inactive by its ID")
	public ResponseEntity<String> deactivateState(@PathVariable(name = "stateId") long id) {

		return new ResponseEntity<String>(stateAndCityManagementService.deactivateState(id), HttpStatus.OK);
	}

	@GetMapping("/states/{stateId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get state by ID", description = "Retrieve a specific state by its ID")
	public ResponseEntity<StateResponseDto> getStateById(@PathVariable(name = "stateId") long id) {
		return new ResponseEntity<StateResponseDto>(stateAndCityManagementService.getStateById(id), HttpStatus.OK);
	}

	@PutMapping("states/{stateId}/activate")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Activate state by ID", description = "Activate a specific state by its ID")
	public ResponseEntity<String> activateStateById(@PathVariable(name = "stateId") long id) {
		return new ResponseEntity<String>(stateAndCityManagementService.activateStateById(id), HttpStatus.OK);
	}

	@PutMapping("cities/{cityId}/activate")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "activate city by ID", description = "activate a specific city by its ID")
	public ResponseEntity<String> activateCityById(@PathVariable(name = "cityId") long cityId) {
		return new ResponseEntity<String>(stateAndCityManagementService.activateCityById(cityId), HttpStatus.OK);
	}

	@PostMapping("states/{stateId}/cities")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Create a new city", description = "Add a new city to a specific state")
	public ResponseEntity<String> createCity(@PathVariable(name = "stateId") long stateId,
			@RequestBody CityRequestDto cityRequestDto) {
		return new ResponseEntity<String>(stateAndCityManagementService.createCity(stateId, cityRequestDto),
				HttpStatus.CREATED);
	}

	@PutMapping("states/{stateId}/cities")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Update city details", description = "Update the details of an existing city")
	public ResponseEntity<CityResponseDto> updateCity(@PathVariable Long stateId,
			@RequestBody CityRequestDto cityRequestDto) {
		return new ResponseEntity<CityResponseDto>(stateAndCityManagementService.updateCity(stateId, cityRequestDto),
				HttpStatus.OK);
	}

	@DeleteMapping("cities/{cityId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate a city", description = "Mark a city as inactive by its ID")
	public ResponseEntity<String> deactivateCity(@PathVariable long cityId) {
		return new ResponseEntity<String>(stateAndCityManagementService.deactivateCity(cityId), HttpStatus.OK);
	}

	@GetMapping("/states/{stateId}/cities")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get all cities for a state", description = "Retrieve all cities for a specific state by the state ID")
	public ResponseEntity<List<CityResponseDto>> getAllCities(@PathVariable long stateId) {
		return new ResponseEntity<List<CityResponseDto>>(stateAndCityManagementService.getAllCitiesByStateId(stateId),
				HttpStatus.OK);
	}

	@GetMapping("/states/{stateId}/cities/{cityId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get city by ID", description = "Retrieve a specific city by its ID")
	public ResponseEntity<CityResponseDto> getCityById(@PathVariable Long stateId, @PathVariable Long cityId) {
		return new ResponseEntity<CityResponseDto>(stateAndCityManagementService.getCityById(cityId), HttpStatus.OK);
	}
}
