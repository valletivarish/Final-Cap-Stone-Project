package com.monocept.myapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Claim;
import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.enums.ClaimStatus;

public interface ClaimRepository extends JpaRepository<Claim, Long> {


	List<Claim> findByCustomer(Customer customer);


	@Query("SELECT c FROM Claim c WHERE "
		       + "(:status IS NULL OR c.status = :status) "
		       + "AND (:customerId IS NULL OR c.customer.id = :customerId) "
		       + "AND (:policyNo IS NULL OR c.policyAccount.policyNo = :policyNo)")
		Page<Claim> findAllWithFilters(@Param("status") ClaimStatus status,
		                               @Param("customerId") Long customerId,
		                               @Param("policyNo") Long policyNo,
		                               Pageable pageable);
	
	@Query("SELECT c FROM Claim c WHERE c.policyAccount.agent.agentId = :agentId")
    Page<Claim> findClaimsByAgentId(long agentId, Pageable pageable);


	
}



