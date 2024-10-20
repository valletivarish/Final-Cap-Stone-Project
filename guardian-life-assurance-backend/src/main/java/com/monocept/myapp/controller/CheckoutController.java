package com.monocept.myapp.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;
import com.monocept.myapp.dto.InstallmentPaymentRequestDto;
import com.monocept.myapp.dto.NomineeDto;
import com.monocept.myapp.dto.PolicyAccountRequestDto;
import com.monocept.myapp.enums.NomineeRelationship;
import com.monocept.myapp.enums.PremiumType;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.InstallmentService;
import com.monocept.myapp.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("guardian-life-assurance/checkout")
public class CheckoutController {

	@Autowired
	private StripeService stripeService;
	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private InstallmentService installmentService;


	@PostMapping("/sessions")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Create a Checkout Session", description = "Creates a checkout session for payments. Requires the amount and request data to initiate a Stripe checkout session. Returns the checkout session URL.")
	public ResponseEntity<String> createCheckoutSession(@Valid @RequestBody Map<String, Object> requestBody) {
		double amount = Double.parseDouble(requestBody.get("amount").toString());
		String successUrl = "http://localhost:3000/success";
		String cancelUrl = "http://localhost:3000/cancel";
		 if (!(requestBody.get("requestData") instanceof Map)) {
	            return ResponseEntity.badRequest().body("Invalid request data format.");
	        }
		 Object requestDataObj = requestBody.get("requestData");
		 Map<String, Object> requestData = null;

		 if (requestDataObj instanceof Map<?, ?>) {
		     Map<?, ?> rawMap = (Map<?, ?>) requestDataObj;
		     
		     boolean isValid = true;
		     for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
		            if (!(entry.getKey() instanceof String)) {
		                isValid = false;
		                break;
		            }
		        }

		     if (isValid) {
		    	 requestData = new HashMap<>();
		            for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
		                String keyStr = (String) entry.getKey();
		                Object value = entry.getValue();
		                requestData.put(keyStr, value);
		            }
		     }else {
		         throw new IllegalArgumentException("Invalid request data format.");
		     }
		 } else {
		     throw new IllegalArgumentException("Invalid request data format.");
		 }

		try {
			Session session = stripeService.createCheckoutSession(amount, successUrl, cancelUrl, requestData);
			return ResponseEntity.ok(session.getUrl());
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
		}
	}

	@PostMapping("/customers/{customerId}/policies/{policyNo}/installments/{installmentId}/sessions")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Create Installment Checkout Session", description = "Creates a Stripe checkout session for paying a specific installment. Requires customer ID, installment ID, and payment details.")
	public ResponseEntity<String> createInstallmentCheckoutSession(@PathVariable(name = "customerId") Long customerId,
			@PathVariable(name = "installmentId") Long installmentId,
			@RequestBody InstallmentPaymentRequestDto paymentRequest) {

		System.out.println("CustomerId: " + customerId + ", InstallmentId: " + installmentId + ", AmountDue: "
				+ paymentRequest.getAmount());
		try {

			String checkoutSessionUrl = stripeService.createInstallmentCheckoutSession(customerId, installmentId,
					paymentRequest);

			return ResponseEntity.ok(checkoutSessionUrl);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Failed to create checkout session: " + e.getMessage());
		}
	}

	@PostMapping("/payments/verify")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Verify Payment", description = "Verifies the payment session using the session ID. If successful, processes policy purchase or installment payment based on the session metadata.")
	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData) throws DocumentException {
		String sessionId = paymentData.get("sessionId");

		try {
			Session session = Session.retrieve(sessionId);
			System.out.println("Session retrieved: " + session);

			if ("paid".equals(session.getPaymentStatus())) {
				String paymentIntentId = session.getPaymentIntent();
				PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
				String chargeId = paymentIntent.getCharges().getData().get(0).getId();

				String paymentType = session.getMetadata().get("type");

				if ("policyPurchase".equals(paymentType)) {

					String insuranceSchemeId = session.getMetadata().get("insuranceSchemeId");
					String premiumType = session.getMetadata().get("premiumType");
					String policyTerm = session.getMetadata().get("policyTerm");
					String premiumAmount = session.getMetadata().get("premiumAmount");
					String customerIdString = session.getMetadata().get("customerId");
					String agentIdString = session.getMetadata().get("agentId");
					System.out.println(session.getMetadata());
					
					List<NomineeDto> nominees = new ArrayList<>();
	                int i = 0;
	                while (session.getMetadata().containsKey("nomineeName" + i) &&
	                       session.getMetadata().containsKey("nomineeRelationship" + i)) {
	                    String nomineeName = session.getMetadata().get("nomineeName" + i);
	                    String nomineeRelationship = session.getMetadata().get("nomineeRelationship" + i);

	                    NomineeDto nominee = new NomineeDto();
	                    nominee.setNomineeName(nomineeName);
	                    nominee.setRelationship(NomineeRelationship.valueOf(nomineeRelationship));

	                    nominees.add(nominee);
	                    i++;
	                }

					PolicyAccountRequestDto accountRequestDto = new PolicyAccountRequestDto();
					accountRequestDto.setInsuranceSchemeId(Long.parseLong(insuranceSchemeId));
					accountRequestDto.setPremiumType(PremiumType.valueOf(premiumType));
					accountRequestDto.setPolicyTerm(Long.parseLong(policyTerm));
					accountRequestDto.setPremiumAmount(Double.parseDouble(premiumAmount));
					accountRequestDto.setStripeToken(chargeId);
					accountRequestDto.setAgentId(Long.parseLong(agentIdString));
					accountRequestDto.setNominees(nominees);  

					Long customerId = Long.parseLong(customerIdString);
					Long policyId = customerManagementService.processPolicyPurchase(accountRequestDto, customerId);

					return ResponseEntity.ok(Map.of("success", true, "policyNo", policyId, "customerId", customerId,
							"paymentType", paymentType));

				} else if ("installmentPayment".equals(paymentType)) {

					String installmentId = session.getMetadata().get("installmentId");
					String customerIdString = session.getMetadata().get("customerId");
					String amountDue = session.getMetadata().get("amountDue");

					InstallmentPaymentRequestDto paymentRequest = new InstallmentPaymentRequestDto();
					paymentRequest.setInstallmentId(Long.parseLong(installmentId));
					paymentRequest.setPaymentToken(chargeId);
					paymentRequest.setAmount(Double.parseDouble(amountDue));
					paymentRequest.setCustomerId(Long.parseLong(customerIdString));

					long policyNo = installmentService.processInstallmentPayment(paymentRequest);

					return ResponseEntity
							.ok(Map.of("success", true, "message", "Installment payment processed successfully",
									"paymentType", paymentType, "customerId", customerIdString, "policyNo", policyNo));

				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							.body(Map.of("success", false, "message", "Unrecognized payment type"));
				}

			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("success", false, "message", "Payment verification failed."));
			}

		} catch (StripeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error verifying payment: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
		}
	}

}
