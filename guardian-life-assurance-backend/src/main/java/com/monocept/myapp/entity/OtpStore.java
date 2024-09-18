package com.monocept.myapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
@Entity
public class OtpStore {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(nullable = false)
	    private String username;  

	    @Column(nullable = false)
	    private String otp;

	    @Column(nullable = false)
	    private LocalDateTime expirationTime;

	   
	    public OtpStore() {}

	   
	    public OtpStore(String username, String otp, LocalDateTime expirationTime) {
	        this.username = username;
	        this.otp = otp;
	        this.expirationTime = expirationTime;
	    }

	    
	    public Long getId() {
	        return id;
	    }

	    public void setId(Long id) {
	        this.id = id;
	    }

	    public String getUsername() {
	        return username;
	    }

	    public void setUsername(String username) {
	        this.username = username;
	    }

	    public String getOtp() {
	        return otp;
	    }

	    public void setOtp(String otp) {
	        this.otp = otp;
	    }

	    public LocalDateTime getExpirationTime() {
	        return expirationTime;
	    }

	    public void setExpirationTime(LocalDateTime expirationTime) {
	        this.expirationTime = expirationTime;
	    }
}
