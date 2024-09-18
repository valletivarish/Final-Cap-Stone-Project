package com.monocept.myapp.service;

import com.monocept.myapp.dto.ResetPasswordRequestDto;
import com.monocept.myapp.entity.Claim;
import com.monocept.myapp.entity.WithdrawalRequest;

public interface EmailService {

	String sendOtpForForgetPassword(String userNameOrEmail);

	String verifyOtpAndSetNewPassword(ResetPasswordRequestDto forgetPasswordRequest);

	void sendClaimApprovalMail(Claim claim);

	void sendWithdrawalApprovalMail(WithdrawalRequest withdrawalRequest);

}
