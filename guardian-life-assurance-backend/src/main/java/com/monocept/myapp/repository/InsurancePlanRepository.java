package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.InsurancePlan;

public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Long> {

	boolean existsByPlanName(String planName);

}
