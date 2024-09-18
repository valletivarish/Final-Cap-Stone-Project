package com.monocept.myapp.service;

import com.itextpdf.text.DocumentException;
import com.monocept.myapp.dto.InstallmentPaymentRequestDto;
import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.entity.Payment;

public interface InstallmentService {

	long processInstallmentPayment(InstallmentPaymentRequestDto paymentRequest) throws DocumentException;

	Installment findInstallmentById(Long installmentId);


	Payment getPaymentByInstallment(Installment installment);

}
