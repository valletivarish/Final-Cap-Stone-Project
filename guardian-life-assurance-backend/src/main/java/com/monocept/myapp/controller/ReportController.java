package com.monocept.myapp.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;
import com.monocept.myapp.dto.AgentEarningsResponseDto;
import com.monocept.myapp.dto.AgentResponseDto;
import com.monocept.myapp.dto.CommissionResponseDto;
import com.monocept.myapp.dto.CustomerResponseDto;
import com.monocept.myapp.dto.PaymentResponseDto;
import com.monocept.myapp.dto.WithdrawalResponseDto;
import com.monocept.myapp.entity.WithdrawalRequest;
import com.monocept.myapp.enums.CommissionType;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.service.AgentEarningsReportService;
import com.monocept.myapp.service.AgentEarningsService;
import com.monocept.myapp.service.AgentManagementService;
import com.monocept.myapp.service.AgentReportService;
import com.monocept.myapp.service.CommissionReportService;
import com.monocept.myapp.service.CommissionService;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.CustomerReportService;
import com.monocept.myapp.service.PaymentReportService;
import com.monocept.myapp.service.PaymentService;
import com.monocept.myapp.service.WithdrawalAgentReportService;
import com.monocept.myapp.service.WithdrawalReportService;
import com.monocept.myapp.service.WithdrawalService;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("guardian-life-assurance")
public class ReportController {

	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private AgentManagementService agentManagementService;

	@Autowired
	private CustomerReportService customerReportService;

	@Autowired
	private AgentReportService agentReportService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private PaymentReportService paymentReportService;

	@Autowired
	private WithdrawalService withdrawalService;

	@Autowired
	private WithdrawalReportService withdrawalReportService;
	@Autowired
	private AgentEarningsService agentEarningsService;

	@Autowired
	private AgentEarningsReportService agentEarningsReportService;

	@Autowired
	private CommissionReportService commissionReportService;

	@Autowired
	private WithdrawalAgentReportService withdrawalAgentReportService;
	
	@Autowired
	private CommissionService commissionService;

	@GetMapping("/customers/pdf")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Generate Customer PDF Report", description = "Generates a PDF report of customers based on provided filters such as name, city, state, and status. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generateCustomerReportPdf(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "name", required = false) String name,
			@RequestParam(name = "city", required = false) String city,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "isActive", required = false) Boolean isActive) throws DocumentException, IOException {

		List<CustomerResponseDto> customers = customerManagementService
				.getAllCustomersWithFilters(page, size, sortBy, direction, name, city, state, isActive).getContent();

		ByteArrayInputStream pdfStream = customerReportService.generateCustomerReport(customers);

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=CustomerReport.pdf");
		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

	@GetMapping("/agents/pdf")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Generate Agent PDF Report", description = "Generates a PDF report of agents based on filters such as name, city, state, and active status. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generateAgentReport(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "agentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "city", required = false) String city,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "isActive", required = false) Boolean isActive,
			@RequestParam(name = "name", required = false) String name) throws DocumentException, IOException {

		PagedResponse<AgentResponseDto> agentResponse = agentManagementService.getAllAgents(page, size, sortBy,
				direction, city, state, isActive, name);
		List<AgentResponseDto> agents = agentResponse.getContent();

		ByteArrayInputStream reportStream = agentReportService.generateAgentReport(agents);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=AgentReport.pdf");

		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(reportStream.readAllBytes());
	}

	@GetMapping("/payments/pdf")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Generate Payment PDF Report", description = "Generates a PDF report of payments based on filters such as amount range, date range, customer ID, and payment ID. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generatePaymentReportPdf(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "paymentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "minAmount", required = false) Double minAmount,
			@RequestParam(name = "maxAmount", required = false) Double maxAmount,
			@RequestParam(name = "startDate", defaultValue = "#{T(java.time.LocalDate).now().minusDays(30).toString()}") String startDate,
			@RequestParam(name = "endDate", defaultValue = "#{T(java.time.LocalDate).now().toString()}") String endDate,
			@RequestParam(name = "policyNo", required = false) Long policyNo) throws DocumentException, IOException {
		LocalDateTime fromDate = parseDate(startDate).atStartOfDay();
		LocalDateTime toDate = parseDate(endDate).atTime(23, 59, 59);

		List<PaymentResponseDto> payments = paymentService.getAllPaymentsWithFilters(page, size, sortBy, direction,
				minAmount, maxAmount, fromDate, toDate, policyNo).getContent();

		ByteArrayInputStream pdfStream = paymentReportService.generatePaymentReport(payments);

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=PaymentReport.pdf");

		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

	private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(DateTimeFormatter.ofPattern("yyyy-MM-dd"),
			DateTimeFormatter.ofPattern("dd-MM-yyyy"));

	private LocalDate parseDate(String dateStr) {
		for (DateTimeFormatter formatter : FORMATTERS) {
			try {
				return LocalDate.parse(dateStr, formatter);
			} catch (DateTimeParseException e) {
			}
		}
		return LocalDate.now();
	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@GetMapping("withdrawal/pdf")
	@Operation(summary = "Generate Withdrawal PDF Report", description = "Generates a PDF report of withdrawal requests based on filters such as customer ID, agent ID, status, and date range. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generateWithdrawalReport(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "customerId", required = false) Long customerId,
			@RequestParam(name = "agentId", required = false) Long agentId,
			@RequestParam(name = "status", required = false) WithdrawalRequestStatus status,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate)
			throws DocumentException, IOException {

		PagedResponse<WithdrawalRequest> withdrawals = withdrawalService.getWithdrawalsWithFilters(customerId, agentId,
				status, fromDate, toDate, page, size, sortBy, direction);
		ByteArrayInputStream pdfStream = withdrawalReportService.generateWithdrawalReport(withdrawals.getContent());

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=WithdrawalReport.pdf");
		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

	@GetMapping("/commission-withdrawal/pdf")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Generate Commission Withdrawal PDF Report", description = "Generates a PDF report of commission withdrawals with filters such as agent ID, status, and date range. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generateCommissionWithdrawalReport(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "agentId", required = false) Long agentId,
			@RequestParam(name = "status", required = false) WithdrawalRequestStatus status,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate)
			throws DocumentException, IOException {

		PagedResponse<WithdrawalResponseDto> commissionWithdrawals = withdrawalService
				.getCommissionWithdrawalsWithFilters(page, size, sortBy, direction, agentId, status, fromDate, toDate);
		ByteArrayInputStream pdfStream = withdrawalAgentReportService
				.generateWithdrawalReport(commissionWithdrawals.getContent());

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=CommissionWithdrawalReport.pdf");
		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

	@GetMapping("/commission/pdf")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Generate Commission PDF Report", description = "Generates a PDF report of commissions based on filters such as agent ID, commission type, date range, and amount. Supports pagination and sorting.")
	public ResponseEntity<byte[]> generateCommissionReport(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "commissionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "agentId", required = false) Long agentId,
			@RequestParam(name = "commissionType", required = false) CommissionType commissionType,
			@RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate)
			throws DocumentException, IOException {

		PagedResponse<CommissionResponseDto> commissions = commissionService.getCommissionsWithFilters(page, size,
				sortBy, direction, agentId, commissionType, fromDate, toDate);
		ByteArrayInputStream pdfStream = commissionReportService.generateCommissionReport(commissions.getContent());

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=CommissionReport.pdf");
		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

	@GetMapping("/agent-earnings/pdf")
	@PreAuthorize("hasRole('AGENT')")
	@Operation(summary = "Generate Agent Earnings PDF Report", description = "Generates a PDF report of agent earnings based on filters such as amount range and date range. Supports pagination.")
	public ResponseEntity<byte[]> generateAgentEarningsReport(
			@RequestParam(name = "minAmount", required = false) Double minAmount,
			@RequestParam(name = "maxAmount", required = false) Double maxAmount,
			@RequestParam(name = "fromDate", defaultValue = "#{T(java.time.LocalDate).now().minusDays(30).toString()}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate fromDate,
			@RequestParam(name = "toDate", defaultValue = "#{T(java.time.LocalDate).now().toString()}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate toDate,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) throws DocumentException, IOException {
		LocalDateTime fromFormatedDate = parseDate(fromDate.toString()).atStartOfDay();
		LocalDateTime toFormatedDate = parseDate(toDate.toString()).atTime(23, 59, 59);
		PagedResponse<AgentEarningsResponseDto> earnings = agentEarningsService.getAgentEarningsWithFilters(minAmount,
				maxAmount, fromFormatedDate, toFormatedDate, page, size);
		ByteArrayInputStream pdfStream = agentEarningsReportService.generateAgentEarningsReport(earnings.getContent());

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "inline; filename=AgentEarningsReport.pdf");
		return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
				.body(pdfStream.readAllBytes());
	}

}
