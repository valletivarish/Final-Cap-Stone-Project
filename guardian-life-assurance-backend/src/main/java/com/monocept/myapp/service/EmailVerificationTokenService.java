package com.monocept.myapp.service;

import com.monocept.myapp.entity.EmailVerificationToken;
import com.monocept.myapp.entity.User;

public interface EmailVerificationTokenService {

	EmailVerificationToken createVerificationToken(String email);

	EmailVerificationToken validateToken(String token);

	void deleteToken(EmailVerificationToken verificationToken);

	void activateUserByRole(User user);

}
