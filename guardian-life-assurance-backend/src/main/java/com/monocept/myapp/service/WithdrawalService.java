package com.monocept.myapp.service;

import java.time.LocalDate;

import com.monocept.myapp.dto.WithdrawalResponseDto;
import com.monocept.myapp.entity.WithdrawalRequest;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.util.PagedResponse;

public interface WithdrawalService {

	void approveWithdrawal(long withdrawalId);

	void rejectWithdrawal(long withdrawalId);


	void createAgentWithdrawalRequest(double amount);

	PagedResponse<WithdrawalRequest> getWithdrawalsWithFilters(Long customerId, Long agentId,
			WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate, int page, int size, String sortBy,
			String direction);

	PagedResponse<WithdrawalResponseDto> getCommissionWithdrawalsWithFilters(int page, int size, String sortBy,
			String direction, Long agentId, WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate);

	PagedResponse<WithdrawalResponseDto> getCommissionWithdrawalsWithFilters(int page, int size, String sortBy,
			String direction, WithdrawalRequestStatus status, LocalDate fromDate, LocalDate toDate);











}
