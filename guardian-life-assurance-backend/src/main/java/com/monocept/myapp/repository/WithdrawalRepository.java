package com.monocept.myapp.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.myapp.entity.WithdrawalRequest;
import com.monocept.myapp.enums.WithdrawalRequestStatus;
import com.monocept.myapp.enums.WithdrawalRequestType;

public interface WithdrawalRepository extends JpaRepository<WithdrawalRequest, Long> {

	@Query("SELECT w FROM WithdrawalRequest w WHERE "
            + "( :customerId IS NULL OR w.customer.customerId = :customerId ) "
            + "AND ( :agentId IS NULL OR w.agent.agentId = :agentId ) "
            + "AND ( :status IS NULL OR w.status = :status ) "
            + "AND ( :fromDate IS NULL OR w.requestDate >= :fromDate ) "
            + "AND ( :toDate IS NULL OR w.requestDate <= :toDate )")
    Page<WithdrawalRequest> findWithFilters(@Param("customerId") Long customerId,
                                            @Param("agentId") Long agentId,
                                            @Param("status") WithdrawalRequestStatus status,
                                            @Param("fromDate") LocalDate fromDate,
                                            @Param("toDate") LocalDate toDate,
                                            Pageable pageable);

    @Query("SELECT w FROM WithdrawalRequest w WHERE w.requestType = 'COMMISSION_WITHDRAWAL' "
            + "AND (:agentId IS NULL OR w.agent.agentId = :agentId) "
            + "AND (:status IS NULL OR w.status = :status) "
            + "AND (:fromDate IS NULL OR w.requestDate >= :fromDate) "
            + "AND (:toDate IS NULL OR w.requestDate <= :toDate)")
    Page<WithdrawalRequest> findCommissionWithdrawals(@Param("agentId") Long agentId,
                                                      @Param("status") WithdrawalRequestStatus status, 
                                                      @Param("fromDate") LocalDateTime fromDateTime, 
                                                      @Param("toDate") LocalDateTime toDateTime, 
                                                      PageRequest pageRequest);



    @Query("SELECT COUNT(w) FROM WithdrawalRequest w WHERE w.requestType = :requestType")
    long countByRequestType(@Param("requestType") WithdrawalRequestType requestType);

}
