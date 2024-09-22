package com.monocept.myapp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.itextpdf.text.DocumentException;
import com.monocept.myapp.dto.InstallmentPaymentRequestDto;
import com.monocept.myapp.entity.Agent;
import com.monocept.myapp.entity.Commission;
import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.entity.Payment;
import com.monocept.myapp.entity.PolicyAccount;
import com.monocept.myapp.enums.CommissionType;
import com.monocept.myapp.enums.InstallmentStatus;
import com.monocept.myapp.enums.PaymentStatus;
import com.monocept.myapp.enums.PolicyStatus;
import com.monocept.myapp.exception.GuardianLifeAssuranceApiException;
import com.monocept.myapp.repository.AgentRepository;
import com.monocept.myapp.repository.CommissionRepository;
import com.monocept.myapp.repository.InstallmentRepository;
import com.monocept.myapp.repository.PaymentRepository;
import com.monocept.myapp.repository.PolicyRepository;

import jakarta.transaction.Transactional;

@Service
public class InstallmentServiceImpl implements InstallmentService {


    @Autowired
    private InstallmentRepository installmentRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PolicyRepository policyAccountRepository;

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private CommissionRepository commissionRepository;


    
    @Transactional
    @Override
    public long processInstallmentPayment(InstallmentPaymentRequestDto request) throws DocumentException {
        Installment installment = installmentRepository.findById(request.getInstallmentId())
                .orElseThrow(() -> new RuntimeException("Installment not found"));

        if (installment.getStatus() != InstallmentStatus.PENDING) {
            throw new RuntimeException("Installment is already paid or not due");
        }
        if (request.getAmount() > installment.getAmountDue()) {
            throw new RuntimeException("Payment amount exceeds the due amount for this installment");
        }

        installment.setAmountPaid(request.getAmount());
        installment.setPaymentDate(LocalDate.now());
        installment.setPaymentReference(request.getPaymentToken());
        installment.setStatus(InstallmentStatus.PAID);

        Payment payment = new Payment();
        payment.setChargeId(request.getPaymentToken());
        payment.setAmount(request.getAmount());
        payment.setCustomerId(request.getCustomerId());
        payment.setStatus(PaymentStatus.PAID);
        PolicyAccount policyAccount = installment.getInsurancePolicy();
        payment.setPolicyAccount(policyAccount);

        policyAccount.getPayments().add(payment);
        paymentRepository.save(payment);
        installmentRepository.save(installment);
        boolean allInstallmentsPaid = policyAccount.getInstallments()
                .stream()
                .allMatch(inst -> inst.getStatus() == InstallmentStatus.PAID);
        if (allInstallmentsPaid) {
            policyAccount.setStatus(PolicyStatus.COMPLETE);
            policyAccountRepository.save(policyAccount);
        }
        policyAccountRepository.save(policyAccount);

        applyInstallmentCommission(policyAccount, request.getAmount());

        return policyAccount.getPolicyNo();
    }

    private void applyInstallmentCommission(PolicyAccount policyAccount, double amount) {
        Agent agent = policyAccount.getAgent();

        if (agent == null) {
            return;
        }

        double commissionRate = policyAccount.getInsuranceScheme().getInstallmentCommRatio();
        double commissionAmount = amount * (commissionRate / 100);

        Commission commission = new Commission();
        commission.setAgent(agent);
        commission.setAmount(commissionAmount);
        commission.setCommissionType(CommissionType.INSTALLMENT);

        commissionRepository.save(commission);
        List<Commission> commissions = agent.getCommissions();
        commissions.add(commission);
        agent.setCommissions(commissions);

        agent.setTotalCommission(agent.getTotalCommission() + commissionAmount);
        agentRepository.save(agent);
    }

	@Override
	public Installment findInstallmentById(Long installmentId) {
		return installmentRepository.findById(installmentId).orElseThrow(()->new GuardianLifeAssuranceApiException(HttpStatus.NOT_FOUND, "Sorry we could not find the installment id provided"));
	}
	
	@Override
	public Payment getPaymentByInstallment(Installment installment) {
        return paymentRepository.findByChargeId(installment.getPaymentReference());
    }

    
}
