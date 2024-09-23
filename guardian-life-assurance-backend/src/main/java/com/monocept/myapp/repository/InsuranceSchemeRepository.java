package com.monocept.myapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.InsuranceScheme;

public interface InsuranceSchemeRepository extends JpaRepository<InsuranceScheme, Long> {

	@Query("SELECT s FROM InsuranceScheme s WHERE "
            + "(:minAmount IS NULL OR s.minAmount >= :minAmount) "
            + "AND (:maxAmount IS NULL OR s.maxAmount <= :maxAmount) "
            + "AND (:minPolicyTerm IS NULL OR s.minPolicyTerm >= :minPolicyTerm) "
            + "AND (:maxPolicyTerm IS NULL OR s.maxPolicyTerm <= :maxPolicyTerm) "
            + "AND (:planId IS NULL OR s.insurancePlan.planId = :planId) "
            + "AND (:schemeName IS NULL OR LOWER(s.schemeName) LIKE LOWER(CONCAT('%', :schemeName, '%'))) "
            + "AND (:active IS NULL OR s.active = :active)")
    Page<InsuranceScheme> findByFilters(
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            @Param("minPolicyTerm") Integer minPolicyTerm,
            @Param("maxPolicyTerm") Integer maxPolicyTerm,
            @Param("planId") Long planId,
            @Param("schemeName") String schemeName,
            @Param("active") Boolean active,
            Pageable pageable);

	Page<InsuranceScheme> findByInsurancePlan_PlanId(Long planId, Pageable pageable);
	
	List<InsuranceScheme> findByInsurancePlan_PlanId(Long planId);

	boolean existsInsuranceSchemeBySchemeName(String schemeName);

}
