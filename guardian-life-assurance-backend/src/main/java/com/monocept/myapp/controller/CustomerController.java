package com.monocept.myapp.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.text.DocumentException;
import com.monocept.myapp.dto.ClaimRequestDto;
import com.monocept.myapp.dto.ClaimResponseDto;
import com.monocept.myapp.dto.CustomerRequestDto;
import com.monocept.myapp.dto.CustomerResponseDto;
import com.monocept.myapp.dto.CustomerSideQueryRequestDto;
import com.monocept.myapp.dto.DocumentRequestDto;
import com.monocept.myapp.dto.DocumentResponseDto;
import com.monocept.myapp.dto.InsuranceSchemeResponseDto;
import com.monocept.myapp.dto.InterestCalculatorRequestDto;
import com.monocept.myapp.dto.InterestCalculatorResponseDto;
import com.monocept.myapp.dto.PolicyAccountRequestDto;
import com.monocept.myapp.dto.PolicyAccountResponseDto;
import com.monocept.myapp.dto.QueryResponseDto;
import com.monocept.myapp.entity.Document;
import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.entity.InsuranceScheme;
import com.monocept.myapp.entity.Payment;
import com.monocept.myapp.entity.PolicyAccount;
import com.monocept.myapp.enums.DocumentType;
import com.monocept.myapp.service.AuthService;
import com.monocept.myapp.service.ClaimService;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.DocumentService;
import com.monocept.myapp.service.GenerateReceiptService;
import com.monocept.myapp.service.InstallmentService;
import com.monocept.myapp.service.InsuranceManagementService;
import com.monocept.myapp.util.ImageUtil;
import com.monocept.myapp.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/guardian-life-assurance/customers")
public class CustomerController {
	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private ClaimService claimService;

	@Autowired
	private AuthService authService;

	@Autowired
	private InstallmentService installmentService;

	@Autowired
	private InsuranceManagementService insuranceManagementService;

	@Autowired
	private GenerateReceiptService generateReceiptService;

	@Autowired
	private DocumentService documentService;

	@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('AGENT')")
	@GetMapping("/{customerID}")
	@Operation(summary = "Get Customer by ID", description = "Fetch customer details using the customer ID.")
	public ResponseEntity<CustomerResponseDto> getCustomerIdById(@PathVariable long customerID) {
		return new ResponseEntity<CustomerResponseDto>(customerManagementService.getCustomerIdById(customerID),
				HttpStatus.OK);
	}

	@PutMapping("/{customerId}/activate")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Activate Customer", description = "Activate a customer by their ID.")
	public ResponseEntity<String> activateCustomer(@PathVariable long customerId) {
		return new ResponseEntity<String>(customerManagementService.activateCustomer(customerId), HttpStatus.OK);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('AGENT')")
	@Operation(summary = "Get All Customers", description = "Retrieve all customers with pagination, sorting, and optional search filters.")
	public ResponseEntity<PagedResponse<CustomerResponseDto>> getAllCustomer(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "ASC") String direction,
			@RequestParam(name = "name", required = false) String name,
			@RequestParam(name = "city", required = false) String city,
			@RequestParam(name = "state", required = false) String state,
			@RequestParam(name = "isActive", required = false) Boolean isActive) {
		return new ResponseEntity<>(customerManagementService.getAllCustomersWithFilters(page, size, sortBy, direction,
				name, city, state, isActive), HttpStatus.OK);
	}

	@GetMapping("/{customerId}/queries")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Customer Queries", description = "Retrieve all queries created by a specific customer.")
	public ResponseEntity<PagedResponse<QueryResponseDto>> getAllQueriesByCustomer(
			@PathVariable(name = "customerId") long customerId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@RequestParam(name = "title", required = false) String title,
			@RequestParam(name = "resolved", required = false) Boolean resolved) {

		return new ResponseEntity<PagedResponse<QueryResponseDto>>(

				customerManagementService.getAllQueriesByCustomer(customerId, page, size, sortBy, direction,title,resolved),
				HttpStatus.OK);
	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("{customerId}/policies")
	@Operation(summary = "Get Customer Policies", description = "Retrieve all policies purchased by a specific customer with pagination.")
	public ResponseEntity<PagedResponse<PolicyAccountResponseDto>> getAllPoliciesByCustomerId(
			@PathVariable(name = "customerId") long customerId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyNo") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
		return new ResponseEntity<PagedResponse<PolicyAccountResponseDto>>(
				customerManagementService.getAllPoliciesByCustomerId(customerId, page, size, sortBy, direction),
				HttpStatus.OK);

	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@GetMapping("/policies")
	@Operation(summary = "Get All Policies", description = "Retrieve all policies purchased by customers with pagination.")
	public ResponseEntity<PagedResponse<PolicyAccountResponseDto>> getAllPolicies(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyNo") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
		return new ResponseEntity<PagedResponse<PolicyAccountResponseDto>>(
				customerManagementService.getAllPolicies(page, size, sortBy, direction), HttpStatus.OK);

	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("{customerId}/policies/{policyId}")
	@Operation(summary = "Get Specific Policy", description = "Fetch a specific policy using the customer ID and policy ID.")
	public ResponseEntity<PolicyAccountResponseDto> getPolicyById(@PathVariable(name = "customerId") long customerId,
			@PathVariable(name = "policyId") long policyId) {
		return new ResponseEntity<PolicyAccountResponseDto>(
				customerManagementService.getPolicyById(customerId, policyId), HttpStatus.OK);

	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping("/{customerId}/documents")
	@Operation(summary = "Upload Document", description = "Upload a document for a customer, such as an Aadhaar card or PAN card.")
	public ResponseEntity<String> uploadDocument(@RequestParam(name = "document") MultipartFile file,
			@RequestParam(name = "documentName") DocumentType documentName,
			@PathVariable(name = "customerId") long customerId) throws IOException {
		return new ResponseEntity<String>(customerManagementService.uploadDocument(file, documentName, customerId),
				HttpStatus.OK);
	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping("/{customerId}/queries")
	@Operation(summary = "Create Customer Query", description = "Create a new query for customer-related issues or inquiries.")
	public ResponseEntity<String> createCustomerQuery(@PathVariable(name = "customerId") long customerId,
			@RequestBody CustomerSideQueryRequestDto customerSideQueryRequestDto) {
		return new ResponseEntity<String>(
				customerManagementService.createCustomerQuery(customerId, customerSideQueryRequestDto),
				HttpStatus.CREATED);
	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping("/{customerId}/policies")
	@Operation(summary = "Buy Policy", description = "Purchase a new policy for a customer.")
	public ResponseEntity<Long> buyPolicy(@RequestBody PolicyAccountRequestDto accountRequestDto,
			@PathVariable(name = "customerId") long customerId) {
		Long policyId = customerManagementService.processPolicyPurchase(accountRequestDto, customerId);
		return new ResponseEntity<>(policyId, HttpStatus.OK);
	}

	@PutMapping
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Update Customer", description = "Update customer information, such as name or contact details.")
	public ResponseEntity<String> updateCustomer(@RequestBody CustomerRequestDto customerRequestDto) {
		return new ResponseEntity<String>(customerManagementService.updateCustomer(customerRequestDto), HttpStatus.OK);
	}

	@DeleteMapping("/{customerId}/queries/{queryId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Delete Customer Query", description = "Delete a customer query using the customer ID and query ID.")
	public ResponseEntity<String> deleteCustomerQuery(@PathVariable(name = "customerId") long customerId,
			@PathVariable(name = "queryId") long queryId) {
		return new ResponseEntity<String>(customerManagementService.deleteQuery(customerId, queryId), HttpStatus.OK);

	}

	@DeleteMapping("/{customerId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
	@Operation(summary = "Deactivate Customer", description = "Deactivate a customer by their ID.")
	public ResponseEntity<String> deactivateCustomer(@PathVariable Long customerId) {
		return new ResponseEntity<String>(customerManagementService.deactivateCustomer(customerId), HttpStatus.OK);
	}

	@PostMapping("{customerId}/claims")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Create Claim", description = "Create an insurance claim for a customer.")
	public ResponseEntity<ClaimResponseDto> createClaim(@PathVariable Long customerId,
			@ModelAttribute ClaimRequestDto claimRequestDto) throws IOException {

		ClaimResponseDto claimResponseDto = claimService.createCustomerClaim(customerId, claimRequestDto);
		return ResponseEntity.ok(claimResponseDto);
	}

	@GetMapping("/{customerId}/claims")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Customer Claims", description = "Retrieve all claims associated with a customer.")
	public ResponseEntity<List<ClaimResponseDto>> getClaimsByCustomerId(@PathVariable Long customerId) {
		List<ClaimResponseDto> claims = claimService.getAllClaimsByCustomerId(customerId);
		return new ResponseEntity<>(claims, HttpStatus.OK);
	}

	@DeleteMapping("{customerId}/policies/{policyNo}/cancel")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Cancel Policy", description = "Cancel a specific policy for a customer.")
	public ResponseEntity<String> policyCancel(@PathVariable(name = "customerId") long customerId,
			@PathVariable(name = "policyNo") long policyNo) {
		return new ResponseEntity<String>(customerManagementService.cancelPolicy(customerId, policyNo), HttpStatus.OK);
	}

	@GetMapping("/details")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Current Customer Details", description = "Retrieve details of the currently logged-in customer.")
	public ResponseEntity<Map<String, Object>> getCurrentCustomerDetails() {
		String currentUserEmail = getCurrentUserEmail();
		Map<String, Object> userDetails = authService.getUserByEmail(currentUserEmail);
		if (userDetails == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(userDetails, HttpStatus.OK);
	}

	@GetMapping("/plans/{planId}/schemes")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Schemes by Plan ID", description = "Retrieve all schemes associated with a specific insurance plan ID.")
	public ResponseEntity<Page<InsuranceSchemeResponseDto>> getSchemesByPlanId(@PathVariable Long planId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "1") int size) {

		Page<InsuranceSchemeResponseDto> schemes = insuranceManagementService.getSchemesByPlanId(planId, page, size);

		return ResponseEntity.ok(schemes);
	}

	@GetMapping("/schemes/{schemeId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Scheme Content", description = "Fetch the content of an insurance scheme by its ID.")
	public ResponseEntity<byte[]> getschemeContent(@PathVariable long schemeId) {
		InsuranceScheme scheme = insuranceManagementService.getSchemeImageById(schemeId);
		byte[] content = ImageUtil.decompressFile(scheme.getSchemeImage());

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "image/jpeg").body(content);
	}

	@PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("/age")
	@Operation(summary = "Get Customer Age", description = "Calculate and retrieve the age of the currently logged-in customer.")
	public ResponseEntity<Integer> getCustomerAge() {
		String username = getCurrentUserEmail();
		int age = customerManagementService.calculateCustomerAgeByUser(username);

		return ResponseEntity.ok(age);
	}

	@GetMapping("installments/{installmentId}/receipt")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Generate Receipt", description = "Generate a PDF receipt for a specific installment.")
	public ResponseEntity<byte[]> generateReceipt(@PathVariable Long installmentId) throws IOException {
		try {
			Installment installment = installmentService.findInstallmentById(installmentId);
			Payment payment = installmentService.getPaymentByInstallment(installment);
			PolicyAccount policyAccount = installment.getInsurancePolicy();

			ByteArrayInputStream pdfStream = generateReceiptService.generateReceipt(installment, payment,
					policyAccount);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "inline; filename=receipt.pdf");

			return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
					.body(pdfStream.readAllBytes());

		} catch (DocumentException e) {
			return ResponseEntity.status(500).body(null);
		} catch (Exception e) {
			return ResponseEntity.status(404).body(null);
		}
	}

	@GetMapping("/{customerId}/documents")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Customer Documents", description = "Retrieve all documents uploaded by a customer.")
	public ResponseEntity<PagedResponse<DocumentResponseDto>> getAllDocumentsOfCustomer(
			@PathVariable(name = "customerId") long customerId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "20") int size,
			@RequestParam(name = "sortBy", defaultValue = "documentId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
		PagedResponse<DocumentResponseDto> response = documentService.getAllDocuments(customerId, page, size, sortBy,
				direction);
		return ResponseEntity.ok(response);

	}

	@GetMapping("documents/{documentId}/download")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Download Document", description = "Download a specific document by its ID.")
	public ResponseEntity<byte[]> downloadDocument(@PathVariable(name = "documentId") int documentId) {
		Document document = documentService.getDocumentById(documentId);
		byte[] content = ImageUtil.decompressFile(document.getContent());

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "image/jpeg").body(content);
	}

	@PutMapping("/documents")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Update Document", description = "Update an existing document for a customer.")
	public ResponseEntity<String> updateDocument(@RequestParam(name = "document") MultipartFile multipartFile,
			@RequestBody DocumentRequestDto documentRequestDto) throws IOException {
		documentRequestDto.setDocument(multipartFile.getBytes());
		return new ResponseEntity<String>(documentService.updateDocument(documentRequestDto), HttpStatus.OK);
	}

	@GetMapping("/documents/document-types")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get Document Types", description = "Retrieve a list of all document types available for upload.")
	public ResponseEntity<List<DocumentType>> getDocumentTypes() {
		List<DocumentType> documentTypes = Arrays.asList(DocumentType.values());
		return ResponseEntity.ok(documentTypes);
	}

	private String getCurrentUserEmail() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			return ((UserDetails) authentication.getPrincipal()).getUsername();
		}
		return null;
	}

	@PostMapping("/interest-calculator")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Calculate Interest", description = "Calculate interest for a given policy using the provided details.")
	public ResponseEntity<InterestCalculatorResponseDto> calculateInterest(
			@RequestBody InterestCalculatorRequestDto interestCalculatorDto) {
		System.out.println(interestCalculatorDto);
		return new ResponseEntity<InterestCalculatorResponseDto>(
				insuranceManagementService.calculateInterest(interestCalculatorDto), HttpStatus.OK);
	}
	@GetMapping("/documents-verification")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Verifies if all required documents for the scheme are uploaded and verified. Returns a list of unverified or missing documents.")
	public ResponseEntity<List<DocumentType>> documentsVerification(@RequestParam Long customerId, @RequestParam Long schemeId) {
	    try {
	        List<DocumentType> unverifiedDocuments = documentService.getUnverifiedDocuments(customerId, schemeId);
	        if (unverifiedDocuments.isEmpty()) {
	            return ResponseEntity.ok().body(Collections.emptyList()); 
	        } else {
	            return ResponseEntity.ok(unverifiedDocuments);
	        }
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.badRequest().body(Collections.singletonList(DocumentType.valueOf("Error: " + e.getMessage())));
	    }
	}

	

}
