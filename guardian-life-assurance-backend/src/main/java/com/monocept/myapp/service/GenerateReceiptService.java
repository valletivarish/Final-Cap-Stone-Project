package com.monocept.myapp.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.monocept.myapp.entity.Installment;
import com.monocept.myapp.entity.Payment;
import com.monocept.myapp.entity.PolicyAccount;

@Service
public class GenerateReceiptService {
	private static final Font TITLE_FONT = new Font(FontFamily.TIMES_ROMAN, 22, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font HEADER_FONT = new Font(FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.WHITE);
    private static final Font NORMAL_FONT = new Font(FontFamily.HELVETICA, 12, Font.NORMAL);
    private static final Font BOLD_FONT = new Font(FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font HIGHLIGHT_FONT = new Font(FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.BLUE);
    private static final Font FOOTER_FONT = new Font(FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.GRAY);
    private static final Font SIGNATURE_FONT = new Font(FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY);

    private static final BaseColor HEADER_BG_COLOR = new BaseColor(0, 102, 204); 
    private static final BaseColor HIGHLIGHT_COLOR = new BaseColor(255, 245, 230); 
    
    public ByteArrayInputStream generateReceipt(Installment installment, Payment payment, PolicyAccount policyAccount) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        addCompanyHeader(document);

        Paragraph receiptTitle = new Paragraph("Installment Payment Receipt", TITLE_FONT);
        receiptTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(receiptTitle);

        document.add(new Paragraph("Date: " + LocalDate.now(), NORMAL_FONT));
        document.add(new Paragraph(" "));

        PdfPTable detailsTable = new PdfPTable(2);
        detailsTable.setWidthPercentage(100);
        detailsTable.setSpacingBefore(10f);
        detailsTable.setSpacingAfter(10f);

        addHighlightedTableCell(detailsTable, "Customer ID", String.valueOf(policyAccount.getCustomer().getCustomerId()));
        addHighlightedTableCell(detailsTable, "Policy Number", String.valueOf(policyAccount.getPolicyNo()));
        addHighlightedTableCell(detailsTable, "Customer Name", policyAccount.getCustomer().getFirstName() + " " + policyAccount.getCustomer().getLastName());
        addHighlightedTableCell(detailsTable, "Scheme Name", policyAccount.getInsuranceScheme().getSchemeName());
        document.add(detailsTable);

        document.add(new Paragraph(" "));

        PdfPTable paymentTable = new PdfPTable(2);
        paymentTable.setWidthPercentage(100);
        paymentTable.setSpacingBefore(10f);
        paymentTable.setSpacingAfter(10f);
        paymentTable.setHeaderRows(1);

        addStyledTableHeader(paymentTable, "Field", "Details");
        addHighlightedTableCell(paymentTable, "Installment ID", String.valueOf(installment.getInstallmentId()));
        addHighlightedTableCell(paymentTable, "Payment Amount", String.format("%.2f", payment.getAmount()));
        addHighlightedTableCell(paymentTable, "Payment Reference", payment.getChargeId());
        addHighlightedTableCell(paymentTable, "Payment Date", String.valueOf(installment.getPaymentDate()));

        document.add(paymentTable);

        addPaidStamp(document);
        addSignaturePlaceholder(document);
        addFooter(document);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCompanyHeader(Document document) throws DocumentException {
        Paragraph companyName = new Paragraph("Guardian Life Assurance", TITLE_FONT);
        companyName.setAlignment(Element.ALIGN_LEFT);
        document.add(companyName);
        document.add(new Paragraph(" ")); 
    }

    private void addStyledTableHeader(PdfPTable table, String header1, String header2) {
        PdfPCell headerCell1 = new PdfPCell(new Phrase(header1, HEADER_FONT));
        PdfPCell headerCell2 = new PdfPCell(new Phrase(header2, HEADER_FONT));

        headerCell1.setBackgroundColor(HEADER_BG_COLOR);
        headerCell2.setBackgroundColor(HEADER_BG_COLOR);

        headerCell1.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell1.setPadding(10);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell2.setPadding(10);

        table.addCell(headerCell1);
        table.addCell(headerCell2);
    }

    private void addHighlightedTableCell(PdfPTable table, String key, String value) {
        PdfPCell cellKey = new PdfPCell(new Phrase(key, BOLD_FONT));
        PdfPCell cellValue = new PdfPCell(new Phrase(value, HIGHLIGHT_FONT));

        cellKey.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cellKey.setHorizontalAlignment(Element.ALIGN_LEFT);
        cellValue.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cellValue.setHorizontalAlignment(Element.ALIGN_LEFT);

        cellKey.setPadding(10);
        cellValue.setPadding(10);
        cellValue.setBackgroundColor(HIGHLIGHT_COLOR);

        table.addCell(cellKey);
        table.addCell(cellValue);
    }

    private void addPaidStamp(Document document) throws DocumentException {
        Paragraph paidStamp = new Paragraph("PAID", new Font(FontFamily.HELVETICA, 48, Font.BOLD, BaseColor.GREEN));
        paidStamp.setAlignment(Element.ALIGN_CENTER);
        paidStamp.setSpacingBefore(20f);
        document.add(paidStamp);
    }

    private void addSignaturePlaceholder(Document document) throws DocumentException {
        Paragraph signatureLine = new Paragraph("______________________\nAuthorized Signature", SIGNATURE_FONT);
        signatureLine.setAlignment(Element.ALIGN_RIGHT);
        signatureLine.setSpacingBefore(20f);
        document.add(signatureLine);

        Paragraph stamp = new Paragraph("Guardian Life Assurance", SIGNATURE_FONT);
        stamp.setAlignment(Element.ALIGN_CENTER);
        stamp.setSpacingBefore(30f);
        document.add(stamp);
    }

    private void addFooter(Document document) throws DocumentException {
        Paragraph footer = new Paragraph("Guardian Life Assurance\nwww.guardianlifeassurance.com", FOOTER_FONT);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10f);
        document.add(footer);
    }
}
