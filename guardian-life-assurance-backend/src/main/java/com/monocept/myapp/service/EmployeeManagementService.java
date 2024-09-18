package com.monocept.myapp.service;

import com.monocept.myapp.dto.EmployeeRequestDto;
import com.monocept.myapp.dto.EmployeeResponseDto;
import com.monocept.myapp.util.PagedResponse;

public interface EmployeeManagementService {

	String createEmployee(EmployeeRequestDto employeeRequestDto);

	PagedResponse<EmployeeResponseDto> getAllEmployees(int page, int size, String sortBy, String direction, String name, Boolean isActive);

	String updateEmployee(EmployeeRequestDto employeeRequestDto);

	String deactivateEmployee(long employeeId);

	EmployeeResponseDto getemployeesIdById(long employeesId);

	String verifyDocument(int documentId);

	String rejectDocument(int documentId);

	EmployeeResponseDto getEmployeeProfile();

}
