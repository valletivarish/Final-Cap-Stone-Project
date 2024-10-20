package com.monocept.myapp.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.ChangePasswordRequestDto;
import com.monocept.myapp.dto.JwtResponse;
import com.monocept.myapp.dto.LoginDto;
import com.monocept.myapp.dto.RegisterDto;
import com.monocept.myapp.entity.Admin;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.EmailVerificationToken;
import com.monocept.myapp.entity.Employee;
import com.monocept.myapp.entity.Role;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.repository.AdminRepository;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CustomerRepository;
import com.monocept.myapp.repository.EmployeeRepository;
import com.monocept.myapp.repository.RoleRepository;
import com.monocept.myapp.repository.UserRepository;

@Service
public class AuthServiceImpl implements AuthService {

	private AuthenticationManager authenticationManager;
	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private PasswordEncoder passwordEncoder;
	private AdminRepository adminRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private EmailVerificationTokenService emailVerificationTokenService;
	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private AgentRepository agentRepository;
	@Autowired
	private EmployeeRepository employeeRepository;

	public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
			RoleRepository roleRepository, PasswordEncoder passwordEncoder, AdminRepository adminRepository) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
		this.adminRepository = adminRepository;
	}

	@Override
	public JwtResponse login(LoginDto loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		String usernameOrEmail = userDetails.getUsername();
		User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
				.orElseThrow(() -> new GuardianLifeAssuranceApiException(HttpStatus.NOT_FOUND, "User not found"));
		String role = userDetails.getAuthorities().stream().map(authority -> authority.getAuthority()).findFirst()
				.orElse("ROLE_CUSTOMER");

		try {
			checkActivationStatus(user);
		} catch (GuardianLifeAssuranceApiException e) {
			EmailVerificationToken token = emailVerificationTokenService.createVerificationToken(user.getEmail());
			String verificationUrl = "http://localhost:3000/verify-email?token=" + token.getToken();
			emailService.sendVerificationEmail(verificationUrl, user.getEmail());

			throw new GuardianLifeAssuranceApiException(HttpStatus.FORBIDDEN,
					"Your account is inactive. A verification link has been sent to your email.");
		}

		return new JwtResponse(usernameOrEmail, role);
	}

	private void checkActivationStatus(User user) {
		if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
			Admin admin = adminRepository.findByUser(user);
			if (admin == null) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
						"No admin account associated with this user.");
			}
			if (!admin.isActive()) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.FORBIDDEN,
						"Your admin account is inactive. Please contact support.");
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_AGENT"))) {
			Agent agent = agentRepository.findByUser(user);
			if (agent == null) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
						"No agent account associated with this user.");
			}
			if (!agent.isActive()) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.FORBIDDEN,
						"Your agent account is inactive. Please contact support.");
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_EMPLOYEE"))) {
			Employee employee = employeeRepository.findByUser(user);
			if (employee == null) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
						"No employee account associated with this user.");
			}
			if (!employee.isActive()) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.FORBIDDEN,
						"Your employee account is inactive. Please contact support.");
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_CUSTOMER"))) {
			Customer customer = customerRepository.findByUser(user);
			if (customer == null) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
						"No customer account associated with this user.");
			}
			if (!customer.isActive()) {
				throw new GuardianLifeAssuranceApiException(HttpStatus.FORBIDDEN,
						"Your customer account is inactive. Please contact support.");
			}
		} else {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Unknown role detected for the user.");
		}
	}

	@Override
	public String register(RegisterDto registerDto) {
		if (userRepository.existsByUsername(registerDto.getUsername())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Username already exists!");
		}

		if (userRepository.existsByEmail(registerDto.getEmail())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
		}

		User user = new User();
		user.setUsername(registerDto.getUsername());
		user.setEmail(registerDto.getEmail());
		user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

		Set<Role> roles = new HashSet<>();
		for (String roleName : registerDto.getRoles()) {
			Role role = roleRepository.findByName(roleName).orElseThrow(
					() -> new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Role not found: " + roleName));
			roles.add(role);
		}

		user.setRoles(roles);
		userRepository.save(user);
		if (registerDto.getRoles().contains("ROLE_ADMIN")) {
			Admin admin = new Admin();
			admin.setName(registerDto.getName());
			admin.setUser(user);
			admin.setActive(true);
			adminRepository.save(admin);
		}

		return "User registered successfully!";
	}

	private String getEmailFromSecurityContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			return userDetails.getUsername();
		}
		return null;
	}

	@Override
	public String changePassword(ChangePasswordRequestDto changePasswordRequestDto) {
		System.out.println(changePasswordRequestDto);
		if (changePasswordRequestDto.getNewPassword() == null || changePasswordRequestDto.getExistingPassword() == null
				|| changePasswordRequestDto.getConfirmPassword() == null) {
			throw new IllegalArgumentException("Password fields cannot be null");
		}
		String userNameOrEmail = getEmailFromSecurityContext();
		System.out.println(userNameOrEmail);
		User user = userRepository.findByUsernameOrEmail(userNameOrEmail, userNameOrEmail).orElse(null);

		if (user == null) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
					"We couldn't find your account. Please try again.");
		}

		if (!passwordEncoder.matches(changePasswordRequestDto.getExistingPassword(), user.getPassword())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
					"The current password you entered is incorrect. Please double-check and try again.");
		}

		if (!changePasswordRequestDto.getNewPassword().equals(changePasswordRequestDto.getConfirmPassword())) {
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
					"The new passwords you entered do not match. Please make sure both passwords are the same.");
		}

		user.setPassword(passwordEncoder.encode(changePasswordRequestDto.getNewPassword()));
		userRepository.save(user);

		return "Your password has been updated successfully. Please use your new password for future logins.";
	}

	@Override
	public Map<String, Object> getUserByEmail(String email) {
		User user = userRepository.findByEmail(email).orElse(null);

		if (user == null) {
			return null;
		}

		String fullName = "User";
		String firstName = "";
		String lastName = "";

		Customer customer = customerRepository.findByUser(user);
		if (customer != null) {
			fullName = customer.getFirstName() + " " + customer.getLastName();
			firstName = customer.getFirstName();
			lastName = customer.getLastName();
		}

		Map<String, Object> userDetails = new HashMap<>();
		userDetails.put("userId", customer.getCustomerId());
		userDetails.put("email", user.getEmail());
		userDetails.put("userName", fullName);
		userDetails.put("firstName", firstName);
		userDetails.put("lastName", lastName);

		return userDetails;
	}

}
