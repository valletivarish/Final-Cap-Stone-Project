package com.monocept.myapp.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.monocept.myapp.entity.Admin;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.EmailVerificationToken;
import com.monocept.myapp.entity.Employee;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.repository.AdminRepository;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CustomerRepository;
import com.monocept.myapp.repository.EmployeeRepository;
import com.monocept.myapp.repository.TokenRepository;
import com.monocept.myapp.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class EmailVerificationTokenServiceImpl implements EmailVerificationTokenService {

	private UserRepository userRepository;

	private AdminRepository adminRepository;

	private AgentRepository agentRepository;

	private CustomerRepository customerRepository;

	private EmployeeRepository employeeRepository;

	private TokenRepository tokenRepository;

	public EmailVerificationTokenServiceImpl(UserRepository userRepository, AdminRepository adminRepository,
			AgentRepository agentRepository, CustomerRepository customerRepository,
			EmployeeRepository employeeRepository, TokenRepository tokenRepository) {
		super();
		this.userRepository = userRepository;
		this.adminRepository = adminRepository;
		this.agentRepository = agentRepository;
		this.customerRepository = customerRepository;
		this.employeeRepository = employeeRepository;
		this.tokenRepository = tokenRepository;
	}

	@Override
	@Transactional
	public EmailVerificationToken createVerificationToken(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST,
						"No account associated with the provided email address: " + email));
		EmailVerificationToken existingToken = tokenRepository.findByUser(user);
		if (existingToken != null) {
			tokenRepository.delete(existingToken);
			tokenRepository.flush();
		}
		String token = UUID.randomUUID().toString();
		EmailVerificationToken verificationToken = new EmailVerificationToken();
		verificationToken.setUser(user);
		verificationToken.setToken(token);
		verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

		return tokenRepository.save(verificationToken);
	}

	@Override
	public EmailVerificationToken validateToken(String token) {
		EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
				.orElseThrow(() -> new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Invalid token"));

		if (verificationToken.isExpired()) {
			tokenRepository.delete(verificationToken);
			throw new GuardianLifeAssuranceApiException(HttpStatus.BAD_REQUEST, "Token expired");
		}

		return verificationToken;
	}

	@Override
	public void activateUserByRole(User user) {
		if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
			Admin admin = adminRepository.findByUser(user);
			if (admin != null) {
				admin.setActive(true);
				adminRepository.save(admin);
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_AGENT"))) {
			Agent agent = agentRepository.findByUser(user);
			if (agent != null) {
				agent.setActive(true);
				agentRepository.save(agent);
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_EMPLOYEE"))) {
			Employee employee = employeeRepository.findByUser(user);
			if (employee != null) {
				employee.setActive(true);
				employeeRepository.save(employee);
			}
		} else if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_CUSTOMER"))) {
			Customer customer = customerRepository.findByUser(user);
			if (customer != null) {
				customer.setActive(true);
				customerRepository.save(customer);
			}
		}
	}
	
	@Transactional
	public void deleteToken(EmailVerificationToken token) {
		tokenRepository.delete(token);
		tokenRepository.flush();
		
	}

}
