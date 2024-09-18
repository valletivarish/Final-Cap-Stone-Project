package com.monocept.myapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.entity.PolicyAccount;
import com.monocept.myapp.enums.InstallmentStatus;

public interface InstallmentRepository extends JpaRepository<Installment, Long> {

	List<Installment> findByInsurancePolicyAndStatus(PolicyAccount policyAccount, InstallmentStatus pending);

}
