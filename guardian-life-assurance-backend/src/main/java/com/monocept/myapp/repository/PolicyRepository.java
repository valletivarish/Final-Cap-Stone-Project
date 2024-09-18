package com.monocept.myapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Customer;
import com.monocept.myapp.entity.PolicyAccount;

public interface PolicyRepository extends JpaRepository<PolicyAccount, Long> {

	Page<PolicyAccount> findAllByCustomer(PageRequest pageRequest, Customer customer);

	@Query("SELECT p FROM PolicyAccount p WHERE p.agent.agentId = :agentId " +
            "AND (:policyNumber IS NULL OR p.policyNo = :policyNumber) " + 
            "AND (:premiumType IS NULL OR p.premiumType = :premiumType) " +
            "AND (:status IS NULL OR p.status = :status)")
    Page<PolicyAccount> findAllByAgentWithFilters(@Param("agentId") Long agentId,
                                                  @Param("policyNumber") Long policyNumber,
                                                  @Param("premiumType") String premiumType,
                                                  @Param("status") String status,
                                                  Pageable pageable);

	@Query("SELECT p FROM PolicyAccount p WHERE p.agent.agentId = :agentId")
    List<PolicyAccount> findPoliciesByAgentId(long agentId);




}
