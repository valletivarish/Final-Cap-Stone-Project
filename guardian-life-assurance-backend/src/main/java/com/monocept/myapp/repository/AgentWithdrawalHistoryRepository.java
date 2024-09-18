package com.monocept.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.myapp.entity.AgentEarnings;

public interface AgentWithdrawalHistoryRepository extends JpaRepository<AgentEarnings, Long>{

}
