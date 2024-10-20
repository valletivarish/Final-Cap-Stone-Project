package com.monocept.myapp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.InstallmentPaymentRequestDto;
import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.enums.InstallmentStatus;
import com.monocept.myapp.repository.InstallmentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StripeService {

	@Value("${api.stripe.key}")
	private String stripeApiKey;
	
	
	@PostConstruct
	public void init() {
		Stripe.apiKey = stripeApiKey;
	}
	
	@Autowired
	private InstallmentRepository installmentRepository;


	public Session createCheckoutSession(double amount, String successUrl, String cancelUrl, Map<String, Object> requestData) {
	    try {
	        String modifiedSuccessUrl = successUrl + "?session_id={CHECKOUT_SESSION_ID}";

	        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
	            .setMode(SessionCreateParams.Mode.PAYMENT)
	            .setSuccessUrl(modifiedSuccessUrl)
	            .setCancelUrl(cancelUrl)
	            .addLineItem(SessionCreateParams.LineItem.builder()
	                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
	                    .setCurrency("INR")
	                    .setUnitAmount((long) (amount * 100))  
	                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
	                        .setName("Policy Payment") 
	                        .build())
	                    .build())
	                .setQuantity(1L)
	                .build());

	        Map<String, String> metadata = new HashMap<>();
	        metadata.put("type", "policyPurchase");
	        metadata.put("insuranceSchemeId", requestData.get("insuranceSchemeId").toString());
	        metadata.put("premiumType", requestData.get("premiumType").toString());
	        metadata.put("policyTerm", requestData.get("policyTerm").toString());
	        metadata.put("sumAssured", requestData.get("assuredAmount").toString());
	        metadata.put("premiumAmount", requestData.get("premiumAmount").toString());
	        metadata.put("customerId", requestData.get("customerId").toString());
	        metadata.put("agentId", requestData.get("agentId").toString());
	        Object nomineeObject = requestData.get("nominees");
	        System.out.println(nomineeObject);
	        if (nomineeObject instanceof List) {
	            List<?> rawNominees = (List<?>) nomineeObject;
	            for (int i = 0; i < rawNominees.size(); i++) {
	                Object nomineeObjectItem = rawNominees.get(i);
	                if (nomineeObjectItem instanceof Map) {
	                    Map<?, ?> rawNominee = (Map<?, ?>) nomineeObjectItem;
	                    if (rawNominee.containsKey("nomineeName") && rawNominee.containsKey("relationship")) {
	                        String nomineeName = rawNominee.get("nomineeName").toString();
	                        String nomineeRelationship = rawNominee.get("relationship").toString();
	                        metadata.put("nomineeName" + i, nomineeName);
	                        metadata.put("nomineeRelationship" + i, nomineeRelationship);
	                    }
	                }
	            }
	        }
	        sessionBuilder.putAllMetadata(metadata);

	        SessionCreateParams params = sessionBuilder.build();
	        return Session.create(params);
	    } catch (StripeException e) {
	        throw new RuntimeException("Stripe checkout session creation failed", e);
	    }
	}
	
	public String createInstallmentCheckoutSession(Long customerId, Long installmentId, InstallmentPaymentRequestDto paymentRequest) {
	    try {
	        Installment installment = installmentRepository.findById(installmentId)
	            .orElseThrow(() -> new RuntimeException("Installment not found"));

	        if (installment.getStatus() != InstallmentStatus.PENDING) {
	            throw new RuntimeException("Installment is already paid or not due");
	        }

	        String successUrl = "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}";
	        String cancelUrl = "http://localhost:3000/cancel";
	        
	        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
	            .setMode(SessionCreateParams.Mode.PAYMENT)
	            .setSuccessUrl(successUrl)
	            .setCancelUrl(cancelUrl)
	            .addLineItem(SessionCreateParams.LineItem.builder()
	                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
	                    .setCurrency("INR")
	                    .setUnitAmount((long) (paymentRequest.getAmount() * 100))
	                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
	                        .setName("Installment Payment for Policy No: " + installment.getInsurancePolicy().getPolicyNo())
	                        .build())
	                    .build())
	                .setQuantity(1L)
	                .build());

	        Map<String, String> metadata = new HashMap<>();
	        metadata.put("type", "installmentPayment");  
	        metadata.put("installmentId", String.valueOf(installmentId));
	        metadata.put("customerId", String.valueOf(customerId));
	        metadata.put("policyNo", String.valueOf(installment.getInsurancePolicy().getPolicyNo()));
	        metadata.put("amountDue", String.valueOf(paymentRequest.getAmount()));
	        sessionBuilder.putAllMetadata(metadata);

	        SessionCreateParams params = sessionBuilder.build();
	        Session session = Session.create(params);
	        return session.getUrl();
	    } catch (StripeException e) {
	        throw new RuntimeException("Stripe checkout session creation failed", e);
	    }
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//	public StripeChargeDto chargeAndCreatePolicy(StripeChargeDto chargeRequest) {
//
//		try {
//			chargeRequest.setSuccess(false);
//			Map<String, Object> chargeParams = new HashMap<>();
//			chargeParams.put("amount", (int) (chargeRequest.getAmount() * 100));
//			chargeParams.put("currency", "INR");
//			chargeParams.put("description",
//					"Payment for id " + chargeRequest.getAdditionalInfo().getOrDefault("ID_TAG", ""));
//			chargeParams.put("source", chargeRequest.getStripeToken());
//			Map<String, Object> metaData = new HashMap<>();
//			metaData.put("id", chargeRequest.getChargeId());
//			metaData.putAll(chargeRequest.getAdditionalInfo());
//			chargeParams.put("metadata", metaData);
//			Charge charge = Charge.create(chargeParams);
//			chargeRequest.setMessage(charge.getOutcome().getSellerMessage());
//
//			if (charge.getPaid()) {
//				chargeRequest.setChargeId(charge.getId());
//				chargeRequest.setSuccess(true);
//
//			}
//			return chargeRequest;
//		} catch (StripeException e) {
//			log.error("StripeService (charge)", e);
//			throw new RuntimeException(e.getMessage());
//		}
//	}
	
//	public StripeChargeDto chargeAndCreatePolicy(StripeChargeDto chargeRequest, String customerName,
//			String customerEmail) {
//		try {
//			chargeRequest.setSuccess(false);
//			Map<String, Object> chargeParams = new HashMap<>();
//
//			chargeParams.put("amount", (int) (chargeRequest.getAmount() * 100));
//			chargeParams.put("currency", "INR");
//
//			chargeParams.put("description", "Payment for policy by customer: " + customerName);
//
//			chargeParams.put("source", chargeRequest.getStripeToken());
//
//			Map<String, Object> metaData = new HashMap<>();
//			metaData.put("customer_name", customerName);
//			metaData.put("customer_email", customerEmail);
//			metaData.put("policy_id", chargeRequest.getAdditionalInfo().getOrDefault("ID_TAG", ""));
//
//			chargeParams.put("metadata", metaData);
//
//			// Create the charge
//			Charge charge = Charge.create(chargeParams);
//			chargeRequest.setMessage(charge.getOutcome().getSellerMessage());
//
//			if (charge.getPaid()) {
//				chargeRequest.setChargeId(charge.getId());
//				chargeRequest.setSuccess(true);
//			}
//
//			return chargeRequest;
//		} catch (StripeException e) {
//			log.error("StripeService (charge)", e);
//			throw new RuntimeException(e.getMessage());
//		}
//	}
//
//	public void processStripeRefund(String chargeId, double amount) {
//		try {
//			Map<String, Object> params = new HashMap<>();
//			params.put("charge", chargeId);
//			params.put("amount", (int) (amount * 100));
//
//			Refund.create(params);
//			System.out.println("Refund successful for charge: " + chargeId);
//		} catch (StripeException e) {
//			throw new RuntimeException("Refund failed: " + e.getMessage());
//		}
//	}
//
//	public void processAgentPayout(String stripeToken, double amount) {
//		try {
//			Map<String, Object> payoutParams = new HashMap<>();
//			payoutParams.put("amount", (int) (amount * 100));
//			payoutParams.put("currency", "INR");
//			payoutParams.put("destination", stripeToken);
//
//			Payout.create(payoutParams);
//			System.out.println("Payout successful for agent.");
//		} catch (StripeException e) {
//			throw new RuntimeException("Payout failed: " + e.getMessage());
//		}
//	}
//
//	public Balance retrieveBalance() {
//		try {
//			return Balance.retrieve();
//		} catch (Exception e) {
//			throw new RuntimeException("Failed to retrieve Stripe balance: " + e.getMessage());
//		}
//	}
//
//	public String processPayment(String paymentToken, double amount) {
//		try {
//			Map<String, Object> params = new HashMap<>();
//			params.put("amount", (int) (amount * 100));
//			params.put("currency", "INR");
//			params.put("source", paymentToken);
//
//			Charge charge = Charge.create(params);
//			return charge.getId();
//		} catch (StripeException e) {
//			throw new RuntimeException("Payment failed: " + e.getMessage());
//		}
//	}
//
//	public void processCustomerPayout(String stripeToken, double amount) {
//		try {
//			Map<String, Object> params = new HashMap<>();
//			params.put("amount", (int) (amount * 100));
//			params.put("currency", "usd");
//			params.put("source", stripeToken);
//
//			Payout.create(params);
//			System.out.println("Payout successful for token: " + stripeToken);
//		} catch (StripeException e) {
//			throw new RuntimeException("Payout failed: " + e.getMessage());
//		}
//	}
//
//	public boolean verifyPayment(String paymentIntentId) {
//		try {
//			PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
//			if ("succeeded".equals(paymentIntent.getStatus())) {
//				return true;
//			} else {
//				return false;
//			}
//		} catch (StripeException e) {
//			throw new RuntimeException("Failed to verify payment: " + e.getMessage());
//		}
//
//	}

//	public Session createWithdrawalCheckoutSession(double amount, String successUrl, String cancelUrl,
//			Map<String, String> metadata) throws StripeException {
//		SessionCreateParams params = SessionCreateParams.builder()
//				.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
//                .setMode(SessionCreateParams.Mode.PAYMENT)
//                .setSuccessUrl(successUrl)
//                .setCancelUrl(cancelUrl)
//                .addLineItem(
//                        SessionCreateParams.LineItem.builder()
//                                .setPriceData(
//                                        SessionCreateParams.LineItem.PriceData.builder()
//                                                .setCurrency("usd")
//                                                .setProductData(
//                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
//                                                                .setName("Agent Withdrawal")
//                                                                .build())
//                                                .setUnitAmount((long) (amount * 100)) // Convert amount to cents
//                                                .build())
//                                .setQuantity(1L)
//                                .build())
//                .putAllMetadata(metadata)
//                .build();
//
//        // Create the session using Stripe's API
//        return Session.create(params);
//	}



}
