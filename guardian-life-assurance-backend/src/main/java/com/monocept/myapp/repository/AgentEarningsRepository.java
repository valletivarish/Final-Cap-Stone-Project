package com.monocept.myapp.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.AgentEarnings;

public interface AgentEarningsRepository extends JpaRepository<AgentEarnings, Long>{

	@Query("SELECT e FROM AgentEarnings e WHERE "
            + "( :agentId IS NULL OR e.agent.agentId = :agentId ) "
            + "AND ( :minAmount IS NULL OR e.amount >= :minAmount ) "
            + "AND ( :maxAmount IS NULL OR e.amount <= :maxAmount ) "
            + "AND ( :fromDate IS NULL OR e.withdrawalDate >= :fromDate ) "
            + "AND ( :toDate IS NULL OR e.withdrawalDate <= :toDate )")
    Page<AgentEarnings> findWithFilters(@Param("agentId") Long agentId,
                                        @Param("minAmount") Double minAmount,
                                        @Param("maxAmount") Double maxAmount,
                                        @Param("fromDate") LocalDateTime fromDate,
                                        @Param("toDate") LocalDateTime toDate,
                                        PageRequest pageRequest);

}
