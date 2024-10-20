package com.monocept.myapp.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.myapp.dto.AgentRequestDto;
import com.monocept.myapp.dto.AgentResponseDto;
import com.monocept.myapp.dto.DocumentResponseDto;
import com.monocept.myapp.dto.EmployeeRequestDto;
import com.monocept.myapp.dto.EmployeeResponseDto;
import com.monocept.myapp.dto.PaymentResponseDto;
import com.monocept.myapp.dto.QueryReplyDto;
import com.monocept.myapp.dto.QueryResponseDto;
import com.monocept.myapp.entity.Document;
import com.monocept.myapp.service.AgentManagementService;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.DashboardService;
import com.monocept.myapp.service.DocumentService;
import com.monocept.myapp.service.EmployeeManagementService;
import com.monocept.myapp.service.PaymentService;
import com.monocept.myapp.util.ImageUtil;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/guardian-life-assurance/employees")
public class EmployeeController {

	@Autowired
	private EmployeeManagementService employeeManagementService;

	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private DocumentService documentService;

	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@PutMapping
	@Operation(summary = "Update Employee", description = "Update the details of an existing employee.")
	public ResponseEntity<String> updateEmployee(@RequestBody EmployeeRequestDto employeeRequestDto) {
		return new ResponseEntity<String>(employeeManagementService.updateEmployee(employeeRequestDto), HttpStatus.OK);
	}

	@GetMapping("/{employeeId}")
	@Operation(summary = "Get Employee by ID", description = "Retrieve the details of an employee by their ID.")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	public ResponseEntity<EmployeeResponseDto> getemployeesIdById(@PathVariable long employeeId) {
		return new ResponseEntity<EmployeeResponseDto>(employeeManagementService.getemployeesIdById(employeeId),
				HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@PutMapping("/documents/{documentId}/approval")
	@Operation(summary = "Approve Document", description = "Approve a document by its ID.")
	public ResponseEntity<String> approveDocument(@PathVariable(name = "documentId") int documentId) {
		String response = employeeManagementService.verifyDocument(documentId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@PutMapping("/documents/{documentId}/rejection")
	@Operation(summary = "Reject Document", description = "Reject a document by its ID.")
	public ResponseEntity<String> rejectDocument(@PathVariable(name = "documentId") int documentId) {

		String response = employeeManagementService.rejectDocument(documentId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('EMPLOYEE')")
	@GetMapping("/customer/queries")
	@Operation(summary = "Get Customer Queries", description = "Retrieve all customer queries with pagination and filters.")
	public ResponseEntity<PagedResponse<QueryResponseDto>> getAllQueries(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@RequestParam(name = "title", required = false) String search,
			@RequestParam(name = "resolved", required = false) Boolean resolved) {
		PagedResponse<QueryResponseDto> response = customerManagementService.getAllQueries(page, size, sortBy,
				direction, search, resolved);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('EMPLOYEE')")
	@PostMapping("/customer/queries/{queryId}/respond")
	public ResponseEntity<String> respondToQuery(@PathVariable(name = "queryId") long queryId,
			@RequestBody QueryReplyDto queryReplyDto) {
		String response = customerManagementService.respondToQuery(queryId, queryReplyDto);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Autowired
	private AgentManagementService agentManagementService;

	@GetMapping("/agents")
	@Operation(summary = "Get All Agents", description = "Retrieve a paginated list of all agents with filters.")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	public ResponseEntity<PagedResponse<AgentResponseDto>> getAllAgents(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "agentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "city", required = false) String city,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "isActive", required = false) Boolean isActive,
			@RequestParam(name = "name", required = false) String name) {
		System.out.println(page);
		System.out.println(size);
		System.out.println(sortBy);
		System.out.println(direction);
		return new ResponseEntity<PagedResponse<AgentResponseDto>>(
				agentManagementService.getAllAgents(page, size, sortBy, direction, city, state, isActive, name),
				HttpStatus.OK);
	}

	private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(DateTimeFormatter.ofPattern("yyyy-MM-dd"),
			DateTimeFormatter.ofPattern("dd-MM-yyyy"));

	@GetMapping("/payments")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get All Payments", description = "Retrieve all payments with pagination and filters.")
	public ResponseEntity<PagedResponse<PaymentResponseDto>> getAllPayments(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "paymentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "minAmount", required = false) Double minAmount,
			@RequestParam(name = "maxAmount", required = false) Double maxAmount,
			@RequestParam(name = "startDate", defaultValue = "#{T(java.time.LocalDate).now().minusDays(30).toString()}") String startDate,
			@RequestParam(name = "endDate", defaultValue = "#{T(java.time.LocalDate).now().toString()}") String endDate,
			@RequestParam(name = "policyNo", required = false) Long policyNo) {

		LocalDateTime fromDate = parseDate(startDate).atStartOfDay();
		LocalDateTime toDate = parseDate(endDate).atTime(23, 59, 59);

		PagedResponse<PaymentResponseDto> payments = paymentService.getAllPaymentsWithFilters(page, size, sortBy,
				direction, minAmount, maxAmount, fromDate, toDate, policyNo);
		return new ResponseEntity<PagedResponse<PaymentResponseDto>>(payments, HttpStatus.OK);
	}

	private LocalDate parseDate(String dateStr) {
		for (DateTimeFormatter formatter : FORMATTERS) {
			try {
				return LocalDate.parse(dateStr, formatter);
			} catch (DateTimeParseException e) {
			}
		}
		return LocalDate.now();
	}

	@PostMapping("/agents")
	@Operation(summary = "Create Agent", description = "Add a new agent to the system.")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	public ResponseEntity<String> createAgent(@Valid @RequestBody AgentRequestDto agentRequestDto) {
		return new ResponseEntity<String>(agentManagementService.createAgent(agentRequestDto), HttpStatus.CREATED);
	}

	@GetMapping("counts")
	@PreAuthorize("hasRole('EMPLOYEE')")
	@Operation(summary = "Get Dashboard Counts", description = "Retrieve count statistics for the employee dashboard.")
	public ResponseEntity<Map<String, Long>> getEmployeeDashboardCounts() {

		return new ResponseEntity<Map<String, Long>>(dashboardService.getEmployeeDashboardCount(), HttpStatus.OK);
	}

	@GetMapping("/documents")
	@PreAuthorize("hasRole('EMPLOYEE')")
	@Operation(summary = "Get All Documents", description = "Retrieve a paginated list of documents with optional filters.")
	public ResponseEntity<PagedResponse<DocumentResponseDto>> getAllDocuments(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(name = "sortBy", defaultValue = "documentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@RequestParam(name = "verified", required = false) Boolean verified) {

		PagedResponse<DocumentResponseDto> response = documentService.getAllDocuments(page, size, sortBy, direction,
				verified);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/documents/{documentId}/content")
	@PreAuthorize("hasRole('EMPLOYEE')")
	@Operation(summary = "Get Document Content", description = "Retrieve the content of a specific document by its ID.")
	public ResponseEntity<byte[]> getDocumentContent(@PathVariable int documentId) {
		Document document = documentService.getDocumentById(documentId);
		byte[] content = ImageUtil.decompressFile(document.getContent());

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "image/jpeg").body(content);
	}

	@GetMapping("/profile")
	@PreAuthorize("hasRole('EMPLOYEE')")
	@Operation(summary = "Get Employee Profile", description = "Retrieve the profile details of the currently logged-in employee.")
	public ResponseEntity<EmployeeResponseDto> getEmployeeByUsername() {
		return new ResponseEntity<EmployeeResponseDto>(employeeManagementService.getEmployeeProfile(), HttpStatus.OK);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Get All Employees", description = "Retrieve a paginated list of all employees with filters.")
	public ResponseEntity<PagedResponse<EmployeeResponseDto>> getAllEmployees(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@RequestParam(name = "name", required = false) String name,
			@RequestParam(name = "isActive", required = false) Boolean isActive) {

		PagedResponse<EmployeeResponseDto> employees = employeeManagementService.getAllEmployees(page, size, sortBy,
				direction, name, isActive);
		return new ResponseEntity<>(employees, HttpStatus.OK);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create Employee", description = "Add a new employee to the system.")
	public ResponseEntity<String> createEmployee(@Valid @RequestBody EmployeeRequestDto employeeRequestDto) {
		return new ResponseEntity<String>(employeeManagementService.createEmployee(employeeRequestDto),
				HttpStatus.CREATED);

	}

	@DeleteMapping("/{employeeId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate Employee", description = "Mark an employee as inactive by their ID.")
	public ResponseEntity<String> deactivateEmployee(@PathVariable(name = "employeeId") long employeeId) {
		return new ResponseEntity<String>(employeeManagementService.deactivateEmployee(employeeId), HttpStatus.OK);
	}
	
	@GetMapping("/details")
	@PreAuthorize("hasRole('EMPLOYEE')")
	@Operation(summary = "Get Current Employee Details", description = "Retrieve details of the currently logged-in employee.")
	public ResponseEntity<Map<String, Object>> getEmployeeDetails(){
		String currentUserEmail = getCurrentUserEmail();
		Map<String, Object> userDetails=employeeManagementService.getUserByEmail(currentUserEmail);
		return new ResponseEntity<>(userDetails, HttpStatus.OK);
	}
	
	private String getCurrentUserEmail() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			return ((UserDetails) authentication.getPrincipal()).getUsername();
		}
		return null;
	}

}
