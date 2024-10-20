package com.monocept.myapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.EmailVerificationToken;
import com.monocept.myapp.entity.User;

public interface TokenRepository extends JpaRepository<EmailVerificationToken, Long> {

	Optional<EmailVerificationToken> findByToken(String token);


	EmailVerificationToken findByUser(User user);

}
