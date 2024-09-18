package com.monocept.myapp.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AgentEarningsResponseDto {
	private long id;
	private Long agentId;
	private String name;
	private Double amount;
	private LocalDateTime withdrawalDate;
}
