package com.monocept.myapp.repository;


import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.Commission;
import com.monocept.myapp.enums.CommissionType;

public interface CommissionRepository extends JpaRepository<Commission, Long> {

	@Query("SELECT c FROM Commission c WHERE "
            + "(:agentId IS NULL OR c.agent.agentId = :agentId) AND "
            + "(:commissionType IS NULL OR c.commissionType = :commissionType) AND "
            + "(:fromDate IS NULL OR c.issueDate >= :fromDate) AND "
            + "(:toDate IS NULL OR c.issueDate <= :toDate)")
    Page<Commission> findAllCommissions(@Param("agentId") Long agentId,
                                        @Param("commissionType") CommissionType commissionType,
                                        @Param("fromDate") LocalDate from,
                                        @Param("toDate") LocalDate to,
                                        Pageable pageable);

}
