package com.monocept.myapp.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.monocept.myapp.entity.WithdrawalRequest;

@Service
public class WithdrawalReportService {

    private static final Font BOLD_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static final Font REGULAR_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.NORMAL);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.BOLD, BaseColor.BLUE);
    private static final BaseColor HEADER_BG_COLOR = new BaseColor(230, 230, 250);

    public ByteArrayInputStream generateWithdrawalReport(List<WithdrawalRequest> withdrawals) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        addCompanyHeader(document);

        PdfPTable withdrawalTable = new PdfPTable(6);
        withdrawalTable.setWidthPercentage(100);
        withdrawalTable.setSpacingBefore(10f);
        withdrawalTable.setSpacingAfter(10f);
        withdrawalTable.setWidths(new int[]{10, 20, 20, 20, 20, 20});
        addTableHeader(withdrawalTable, "Request ID", "Customer/Agent", "Amount", "Request Date", "Status", "Type");

        for (WithdrawalRequest withdrawal : withdrawals) {
            String customerAgent = withdrawal.getCustomer() != null
                    ? withdrawal.getCustomer().getFirstName() + " " + withdrawal.getCustomer().getLastName()
                    : withdrawal.getAgent().getFirstName() + " " + withdrawal.getAgent().getLastName();
            addRow(withdrawalTable,
                    String.valueOf(withdrawal.getWithdrawalRequestId()),
                    customerAgent,
                    String.valueOf(withdrawal.getAmount()),
                    withdrawal.getRequestDate().toString(),
                    withdrawal.getStatus().toString(),
                    withdrawal.getRequestType().toString());
        }

        document.add(withdrawalTable);
        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCompanyHeader(Document document) throws DocumentException {
        Paragraph header = new Paragraph("Guardian Life Assurance - Withdrawal Report", HEADER_FONT);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(new Paragraph("Report generated on: " + LocalDateTime.now(), REGULAR_FONT));
        document.add(new Paragraph(" "));
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell();
            headerCell.setPhrase(new Phrase(header, BOLD_FONT));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(8);
            headerCell.setBackgroundColor(HEADER_BG_COLOR);
            table.addCell(headerCell);
        }
    }

    private void addRow(PdfPTable table, String... values) {
        for (String value : values) {
            PdfPCell cell = new PdfPCell();
            cell.setPhrase(new Phrase(value, REGULAR_FONT));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }
    }
}
