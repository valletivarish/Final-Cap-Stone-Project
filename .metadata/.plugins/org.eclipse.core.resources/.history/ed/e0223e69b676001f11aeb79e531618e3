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
		        customerFirstName, customerLastName, claim.getPolicyAccount().getPolicyNo(), claim.getClaimAmount()
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



}