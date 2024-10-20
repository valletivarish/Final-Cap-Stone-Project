package com.monocept.myapp.service;

import com.monocept.myapp.dto.ResetPasswordRequestDto;
import com.monocept.myapp.entity.Claim;
import com.monocept.myapp.entity.CustomerQuery;
import com.monocept.myapp.entity.Employee;
import com.monocept.myapp.entity.WithdrawalRequest;

public interface EmailService {

	String sendOtpForForgetPassword(String userNameOrEmail);

	String verifyOtpAndSetNewPassword(ResetPasswordRequestDto forgetPasswordRequest);

	void sendClaimApprovalMail(Claim claim);

	void sendWithdrawalApprovalMail(WithdrawalRequest withdrawalRequest);

	void sendQueryResponseEmail(Employee employee, CustomerQuery query);

	void sendVerificationEmail(String verificationUrl, String email);

	void sendEmployeeCreationMail(String firstName, String lastName, String email, String password);

}
