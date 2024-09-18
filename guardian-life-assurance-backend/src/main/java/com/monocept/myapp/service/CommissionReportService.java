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
import com.monocept.myapp.dto.CommissionResponseDto;

@Service
public class CommissionReportService {

    private static final Font BOLD_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static final Font REGULAR_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.NORMAL);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.BOLD, BaseColor.BLUE);

    public ByteArrayInputStream generateCommissionReport(List<CommissionResponseDto> commissions)
            throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // Add report header
        Paragraph header = new Paragraph("Commission Report", HEADER_FONT);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(new Paragraph("Report generated on: " + LocalDateTime.now(), REGULAR_FONT));
        document.add(new Paragraph(" "));

        // Table setup
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new int[] { 10, 20, 20, 20, 20 });
        addTableHeader(table, "Commission ID", "Commission Type", "Amount", "Agent ID", "Agent Name");

        // Add content to the table
        for (CommissionResponseDto commission : commissions) {
            String agentName = commission.getAgentName();
            addRow(table, 
                   String.valueOf(commission.getCommissionId()), 
                   commission.getCommissionType().toString(), 
                   String.valueOf(commission.getAmount()), 
                   String.valueOf(commission.getAgentId()), 
                   agentName);
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell();
            headerCell.setPhrase(new Phrase(header, BOLD_FONT));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(8);
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
