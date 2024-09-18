package com.monocept.myapp.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.monocept.myapp.enums.WithdrawalRequestType;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CityRepository;
import com.monocept.myapp.repository.ClaimRepository;
import com.monocept.myapp.repository.CommissionRepository;
import com.monocept.myapp.repository.CustomerRepository;
import com.monocept.myapp.repository.DocumentRepository;
import com.monocept.myapp.repository.EmployeeRepository;
import com.monocept.myapp.repository.InsurancePlanRepository;
import com.monocept.myapp.repository.InsuranceSchemeRepository;
import com.monocept.myapp.repository.PaymentRepository;
import com.monocept.myapp.repository.PolicyRepository;
import com.monocept.myapp.repository.QueryRepository;
import com.monocept.myapp.repository.StateRepository;
import com.monocept.myapp.repository.WithdrawalRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DashboardService {
    
    private StateRepository stateRepository;
    private CityRepository cityRepository;
    private ClaimRepository claimRepository;
    private PolicyRepository policyRepository;
    private PaymentRepository paymentRepository;
    private CommissionRepository commissionRepository;
    private WithdrawalRepository withdrawalRepository;
    private InsurancePlanRepository insurancePlanRepository;
    private InsuranceSchemeRepository insuranceSchemeRepository;
    private QueryRepository queryRepository;
    private DocumentRepository documentRepository;
    private EmployeeRepository employeeRepository;
    private AgentRepository agentRepository;
    private CustomerRepository customerRepository;

    public Map<String, Long> getAdminDashboardCount() {
        Map<String, Long> counts = new HashMap<>();
        
        long statesCount = stateRepository.count();
        long citiesCount = cityRepository.count();
        long claimsCount = claimRepository.count();
        long policyAccountsCount = policyRepository.count();
        long paymentsCount = paymentRepository.count();
        long commissionsCount = commissionRepository.count();
        long withdrawnCommissionsCount = withdrawalRepository.countByRequestType(WithdrawalRequestType.COMMISSION_WITHDRAWAL);
        long plansCount = insurancePlanRepository.count();
        long schemesCount = insuranceSchemeRepository.count();
        long employeesCount = employeeRepository.count();
        long queriesCount = queryRepository.count();
        
        counts.put("states", statesCount);
        counts.put("cities", citiesCount);
        counts.put("claims", claimsCount);
        counts.put("policyAccounts", policyAccountsCount);
        counts.put("payments", paymentsCount);
        counts.put("commissions", commissionsCount);
        counts.put("withdrawnCommissions", withdrawnCommissionsCount);
        counts.put("plans", plansCount);
        counts.put("schemes", schemesCount);
        counts.put("employees", employeesCount);
        counts.put("queries", queriesCount);
        
        return counts;
    }

    public Map<String, Long> getEmployeeDashboardCount() {
        Map<String, Long> counts = new HashMap<>();
        
        long agentsCount = agentRepository.count(); 
        long withdrawnCommissionsCount = withdrawalRepository.countByRequestType(WithdrawalRequestType.COMMISSION_WITHDRAWAL);
        long employeesCount = employeeRepository.count();
        long customersCount = customerRepository.count();
        long customerDocumentsCount = documentRepository.count();
        long plansCount = insurancePlanRepository.count();
        long schemesCount = insuranceSchemeRepository.count();
        long policyAccountsCount = policyRepository.count();
        long policyPaymentsCount = paymentRepository.count();
        long policyClaimsCount = claimRepository.count();
        long commissionsCount = commissionRepository.count();
        long queriesCount = queryRepository.count();
        long statesCount = stateRepository.count();
        long citiesCount = cityRepository.count();

        counts.put("agents", agentsCount);
        counts.put("employees", employeesCount);
        counts.put("customers", customersCount);
        counts.put("customerDocuments", customerDocumentsCount);
        counts.put("plans", plansCount);
        counts.put("schemes", schemesCount);
        counts.put("policyAccounts", policyAccountsCount);
        counts.put("policyPayments", policyPaymentsCount);
        counts.put("policyClaims", policyClaimsCount);
        counts.put("commissions", commissionsCount);
        counts.put("withdrawnCommissions", withdrawnCommissionsCount);
        counts.put("queries", queriesCount);
        counts.put("states", statesCount);
        counts.put("cities", citiesCount);
        
        return counts;
    }

}
