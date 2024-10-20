package com.monocept.myapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.myapp.dto.ChangePasswordRequestDto;
import com.monocept.myapp.dto.CustomerRequestDto;
import com.monocept.myapp.dto.ForgetPasswordRequestDto;
import com.monocept.myapp.dto.JwtResponse;
import com.monocept.myapp.dto.LoginDto;
import com.monocept.myapp.dto.RegisterDto;
import com.monocept.myapp.dto.ResetPasswordRequestDto;
import com.monocept.myapp.entity.EmailVerificationToken;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.security.JwtTokenProvider;
import com.monocept.myapp.service.AuthService;
import com.monocept.myapp.service.CustomerManagementService;
import com.monocept.myapp.service.EmailService;
import com.monocept.myapp.service.EmailVerificationTokenService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/guardian-life-assurance/auth")
@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = HttpHeaders.AUTHORIZATION)
public class AuthController {

	private AuthService authService;
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@Autowired
	private CustomerManagementService customerManagementService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private EmailVerificationTokenService emailVerificationTokenService;
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	

	@PostMapping("/customer-registration")
	@Operation(summary = "Register a Customer", description = "Create a new customer account.")
	public ResponseEntity<String> createCustomer(@RequestBody CustomerRequestDto customerRequestDto) {
		return new ResponseEntity<String>(customerManagementService.createCustomer(customerRequestDto),
				HttpStatus.CREATED);
	}

	@PostMapping("/login")
	@Operation(summary = "User Login", description = "Authenticate user and generate JWT token.")
	public ResponseEntity<?> login(@RequestBody LoginDto loginRequest) {
		JwtResponse jwtResponse = authService.login(loginRequest);

		String token = jwtTokenProvider.generateToken(SecurityContextHolder.getContext().getAuthentication());

		return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, token).body(jwtResponse);
	}

	@PostMapping(value = { "/register" })
	@Operation(summary = "Register a User", description = "Register a new user account for admin or employee roles.")
	public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {

		logger.trace("A TRACE Message" + registerDto);
		logger.debug("A DEBUG Message");
		logger.info("An INFO Message");
		logger.warn("A WARN Message");
		logger.error("An ERROR Message");
		String response = authService.register(registerDto);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PostMapping("/send-otp")
	@Operation(summary = "Send OTP for Password Reset", description = "Send a One-Time Password (OTP) for resetting the user's password.")
	public ResponseEntity<String> sendOtpForForgetPassword(
			@RequestBody ForgetPasswordRequestDto otpForgetPasswordRequest) {
		String response = emailService.sendOtpForForgetPassword(otpForgetPasswordRequest.getUsernameOrEmail());
		System.out.println(response);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/verify-otp")
	@Operation(summary = "Verify OTP and Set New Password", description = "Verify the OTP and set a new password for the user.")
	public ResponseEntity<String> verifyOtpAndSetNewPassword(
			@RequestBody ResetPasswordRequestDto forgetPasswordRequest) {
		String response = emailService.verifyOtpAndSetNewPassword(forgetPasswordRequest);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/change-password")
	@Operation(summary = "Change Password", description = "Change the password for the logged-in user.")
	public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequestDto changePasswordRequestDto) {
		return new ResponseEntity<String>(authService.changePassword(changePasswordRequestDto), HttpStatus.OK);
	}

	@GetMapping("/verify-admin")
	@Operation(summary = "Verify Admin Role", description = "Check if the logged-in user has an Admin role.")
	public ResponseEntity<Boolean> verifyAdmin(@RequestHeader(name = "Authorization", required = true) String token) {
		if (token == "") {
			return ResponseEntity.ok(false);
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		if (jwtTokenProvider.validateToken(token)) {
			Authentication authentication = jwtTokenProvider.getAuthentication(token);
			if (authentication != null && authentication.getAuthorities().stream()
					.anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
				return ResponseEntity.ok(true);
			}
		}
		return ResponseEntity.ok(false);
	}

	@GetMapping("/verify-employee")
	@Operation(summary = "Verify Employee Role", description = "Check if the logged-in user has an Employee role.")
	public ResponseEntity<Boolean> verifyEmployee(
			@RequestHeader(name = "Authorization", required = true) String token) {
		if (token == "") {
			return ResponseEntity.ok(false);
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		if (jwtTokenProvider.validateToken(token)) {
			Authentication authentication = jwtTokenProvider.getAuthentication(token);
			if (authentication != null && authentication.getAuthorities().stream()
					.anyMatch(auth -> auth.getAuthority().equals("ROLE_EMPLOYEE"))) {
				return ResponseEntity.ok(true);
			}
		}
		return ResponseEntity.ok(false);
	}

	@GetMapping("/verify-agent")
	@Operation(summary = "Verify Agent Role", description = "Check if the logged-in user has an Agent role.")
	public ResponseEntity<Boolean> verifyAgent(@RequestHeader(name = "Authorization", required = true) String token) {
		if (token == "") {
			return ResponseEntity.ok(false);
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		if (jwtTokenProvider.validateToken(token)) {
			Authentication authentication = jwtTokenProvider.getAuthentication(token);
			if (authentication != null && authentication.getAuthorities().stream()
					.anyMatch(auth -> auth.getAuthority().equals("ROLE_AGENT"))) {
				return ResponseEntity.ok(true);
			}
		}
		return ResponseEntity.ok(false);
	}

	@GetMapping("/verify-customer")
	@Operation(summary = "Verify Customer Role", description = "Check if the logged-in user has a Customer role.")
	public ResponseEntity<Boolean> verifyCustomer(
			@RequestHeader(name = "Authorization", required = true) String token) {
		if (token == "") {
			return ResponseEntity.ok(false);
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		if (jwtTokenProvider.validateToken(token)) {
			Authentication authentication = jwtTokenProvider.getAuthentication(token);
			if (authentication != null && authentication.getAuthorities().stream()
					.anyMatch(auth -> auth.getAuthority().equals("ROLE_CUSTOMER"))) {
				return ResponseEntity.ok(true);
			}
		}
		return ResponseEntity.ok(false);
	}
	
	
	@GetMapping("/verify-email")
	public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
	    EmailVerificationToken verificationToken = emailVerificationTokenService.validateToken(token);
	    User user = verificationToken.getUser();
	    emailVerificationTokenService.activateUserByRole(user);
	    emailVerificationTokenService.deleteToken(verificationToken);

	    return ResponseEntity.ok("Account verified successfully");
	}


}
