package com.monocept.myapp.service;

import com.monocept.myapp.dto.AdminRequestDto;
import com.monocept.myapp.dto.AdminResponseDto;
import com.monocept.myapp.util.PagedResponse;

import jakarta.validation.Valid;

public interface AdminService {

	

	String updateAdmin(@Valid AdminRequestDto adminRequestDto);

	String deleteAdmin(long adminId);

	String addAdmin(@Valid AdminRequestDto adminRequestDto);

	String activateAdmin(long adminId);

	PagedResponse<AdminResponseDto> getAllAdmin(int page, int size, String sortBy, String direction);

	AdminResponseDto getAdmin(long adminId);

	AdminResponseDto getAdminByUsername();

	

}
