package com.monocept.myapp.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.monocept.myapp.dto.ResetPasswordRequestDto;
import com.monocept.myapp.entity.Claim;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.CustomerQuery;
import com.monocept.myapp.entity.Employee;
import com.monocept.myapp.entity.OtpStore;
import com.monocept.myapp.entity.User;
import com.monocept.myapp.entity.WithdrawalRequest;
import com.monocept.myapp.exception.GuardianLifeAssuranceException;
import com.monocept.myapp.exception.GuardianLifeAssuranceException.ResourceNotFoundException;
import com.monocept.myapp.repository.OtpRepository;
import com.monocept.myapp.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class EmailServiceImpl implements EmailService {

	@Value("${spring.mail.username}")
	private String fromMail;

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private OtpRepository otpRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public void sendEmail(String toMail, String subject, String emailBody) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom(fromMail);
		mailMessage.setTo(toMail);
		mailMessage.setSubject(subject);
		mailMessage.setText(emailBody);
		javaMailSender.send(mailMessage);
	}

	public String generateOTP() {
		Random random = new Random();
		int otp = 1000 + random.nextInt(9000);
		return String.valueOf(otp);
	}

	public void sendOtpEmail(String toMail, String otp) {
		String subject = "Password Reset OTP";
		String emailBody = "Your OTP for resetting the password is: " + otp;
		sendEmail(toMail, subject, emailBody);
	}

	public String sendOtpForForgetPassword(String username) {

		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
		if (oUser.isEmpty()) {
			throw new ResourceNotFoundException("User not available for username: " + username);
		}
		User user = oUser.get();

		String otp = generateOTP();
		LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
		OtpStore otpEntity = new OtpStore(user.getUsername(), otp, expirationTime);
		otpRepository.save(otpEntity);

		sendOtpEmail(user.getEmail(), otp);

		return "OTP sent to your registered email.";
	}

	@Transactional
	public String verifyOtpAndSetNewPassword(ResetPasswordRequestDto forgetPasswordRequest) {
		String username = forgetPasswordRequest.getUsernameOrEmail();
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
		if (oUser.isEmpty()) {
			throw new ResourceNotFoundException("User not available for username: " + username);
		}
		User user = oUser.get();

		Optional<OtpStore> otpEntityOptional = otpRepository.findByUsernameAndOtp(user.getUsername(),
				forgetPasswordRequest.getOtp());
		if (otpEntityOptional.isEmpty() || otpEntityOptional.get().getExpirationTime().isBefore(LocalDateTime.now())) {
			throw new GuardianLifeAssuranceException("Invalid or expired OTP");
		}

		if (!forgetPasswordRequest.getNewPassword().equals(forgetPasswordRequest.getConfirmPassword())) {
			throw new GuardianLifeAssuranceException("Confirm password does not match new password");
		}

		user.setPassword(passwordEncoder.encode(forgetPasswordRequest.getNewPassword()));
		userRepository.save(user);

		otpRepository.deleteByUsername(user.getUsername());

		return "Password updated successfully";
	}

	public void sendClaimApprovalMail(Claim claim) {
	    String customerFirstName = claim.getCustomer().getFirstName();
	    String customerLastName = claim.getCustomer().getLastName();
	    String customerEmail = claim.getCustomer().getUser().getEmail();
	    double claimDeductionPercentage = claim.getPolicyAccount().getInsuranceSetting().getClaimDeductionPercentage()/100;
	    double claimAmount=claim.getClaimAmount()-(claim.getClaimAmount()*(claimDeductionPercentage));

	    String subject = "Guardian Life Assurance - Claim Approved";

	    String body = String.format(
		        "Dear %s %s,\n\n"
		        + "We are pleased to inform you that your claim for the policy number %d has been approved. "
		        + "The claim amount of %.2f will be processed, and you should expect to receive it in your registered account "
		        + "within 3-5 working days.\n\n"
		        + "If you have any questions or need further assistance, please don't hesitate to contact us.\n\n"
		        + "Thank you for trusting Guardian Life Assurance with your insurance needs.\n\n"
		        + "Best regards,\n"
		        + "Guardian Life Assurance",
		        customerFirstName, customerLastName, claim.getPolicyAccount().getPolicyNo(), claimAmount
		    );
		    sendEmail(customerEmail, subject, body);
		}

	public void sendWithdrawalApprovalMail(WithdrawalRequest withdrawal) {
	    String agentFirstName = withdrawal.getAgent().getFirstName();
	    String agentLastName = withdrawal.getAgent().getLastName();
	    String agentEmail = withdrawal.getAgent().getUser().getEmail();

	    String subject = "Guardian Life Assurance - Withdrawal Request Approved";

	    String body = String.format(
	        "Dear %s %s,\n\n"
	        + "We are pleased to inform you that your withdrawal request with request ID %d has been approved. "
	        + "The amount of %.2f will be processed, and you should expect to receive it in your registered account "
	        + "within 3-5 working days.\n\n"
	        + "If you have any questions or need further assistance, please don't hesitate to contact us.\n\n"
	        + "Thank you for trusting Guardian Life Assurance with your services.\n\n"
	        + "Best regards,\n"
	        + "Guardian Life Assurance",
	        agentFirstName, agentLastName, withdrawal.getWithdrawalRequestId(), withdrawal.getAmount()
	    );
	    sendEmail(agentEmail, subject, body);
	}

	@Override
	public void sendQueryResponseEmail(Employee employee, CustomerQuery query) {
		String employeeName = employee.getFirstName() + " " + employee.getLastName();
		String subject="Query ID "+query.getQueryId()+" Resolved - Response from Guardian Life Asuurance";
	    String emailMessage = "Dear Customer,\n\n" +
	        "We are pleased to inform you that your query with ID: " + query.getQueryId() + 
	        " has been successfully resolved by our representative, " + employeeName + ".\n\n" +
	        "Response: " + query.getResponse() + "\n\n" +
	        "Thank you for your patience and trust in Guardian Life Assurance.\n" +
	        "Please don't hesitate to contact us if you need further assistance.\n\n" +
	        "Best regards,\n" +
	        "Guardian Life Assurance Team";
	    Customer customer = query.getCustomer();
	    User user = customer.getUser();
	    String customerEmail=user.getEmail();
	    sendEmail(customerEmail,subject,emailMessage);
		
	}

	@Override
	public void sendVerificationEmail(String verificationUrl, String email) {
	    String subject = "Guardian Life Assurance - Reactivate Your Account";
	    
	    String body = String.format(
	        "Dear User,\n\n" +
	        "Your account with Guardian Life Assurance has been deactivated. To regain access and reactivate your account, please verify your email address by clicking the link below:\n\n" +
	        "%s\n\n" +
	        "This link will expire in 15 minutes. If you did not request this action or believe this was a mistake, please contact our support team.\n\n" +
	        "Thank you for your prompt attention to this matter.\n\n" +
	        "Best regards,\n" +
	        "Guardian Life Assurance Team", verificationUrl
	    );

	    sendEmail(email, subject, body);
	}

	public void sendAgentCreationMail(String firstName, String lastName, String email, String password) {
	    String subject = "Guardian Life Assurance - Your Login Credentials";

	    String body = String.format(
	        "Dear %s %s,\n\n" +
	        "Your agent account has been created. Please use the following credentials to log in:\n\n" +
	        "Email: %s\n" +
	        "Password: %s\n\n" +
	        "For your security, please log in and navigate to the profile section to change your password immediately. Follow the steps below:\n\n" +
	        "1. Log in to your account.\n" +
	        "2. Go to the top-right corner of the screen.\n" +
	        "3. Click on 'Profile' → 'Change Password'.\n\n" +
	        "Please update your password to prevent any unauthorized access or misuse.\n\n" +
	        "Best regards,\n" +
	        "Guardian Life Assurance Team",
	        firstName, lastName, email, password
	    );

	    sendEmail(email, subject, body);
	}

	public void sendEmployeeCreationMail(String firstName, String lastName, String email, String password) {
	    String subject = "Guardian Life Assurance - Your Employee Login Credentials";

	    String body = String.format(
	        "Dear %s %s,\n\n" +
	        "Your employee account has been created. Please use the following credentials to log in:\n\n" +
	        "Email: %s\n" +
	        "Password: %s\n\n" +
	        "For your security, please log in and navigate to the profile section to change your password immediately. Follow the steps below:\n\n" +
	        "1. Log in to your account.\n" +
	        "2. Go to the top-right corner of the screen.\n" +
	        "3. Click on 'Profile' → 'Change Password'.\n\n" +
	        "Please update your password to prevent any unauthorized access or misuse.\n\n" +
	        "Best regards,\n" +
	        "Guardian Life Assurance Team",
	        firstName, lastName, email, password
	    );

	    sendEmail(email, subject, body);
	}





}