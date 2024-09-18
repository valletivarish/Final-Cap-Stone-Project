package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.InsuranceSetting;

public interface InsuranceSettingRepository extends JpaRepository<InsuranceSetting, Long>{

	InsuranceSetting findTopByOrderByUpdatedAtDesc();


}
