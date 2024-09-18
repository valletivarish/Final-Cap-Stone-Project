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
import com.monocept.myapp.dto.AgentEarningsResponseDto;

@Service
public class AgentEarningsReportService {

    private static final Font BOLD_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static final Font REGULAR_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.NORMAL);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.BOLD, BaseColor.BLUE);
    private static final BaseColor HEADER_BG_COLOR = new BaseColor(230, 230, 250);

    public ByteArrayInputStream generateAgentEarningsReport(List<AgentEarningsResponseDto> list) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        addCompanyHeader(document);

        PdfPTable earningsTable = new PdfPTable(5);
        earningsTable.setWidthPercentage(100);
        earningsTable.setSpacingBefore(10f);
        earningsTable.setSpacingAfter(10f);
        earningsTable.setWidths(new int[]{10, 20, 20, 20, 20});
        addTableHeader(earningsTable, "Earning ID","Agent Id", "Agent Name", "Amount", "Withdrawal Date");

        for (AgentEarningsResponseDto earning : list) {
            addRow(earningsTable,
                    String.valueOf(earning.getId()),
                    String.valueOf(earning.getAgentId()),
                    earning.getName(),
                    String.valueOf(earning.getAmount()),
                    earning.getWithdrawalDate().toString());
        }

        document.add(earningsTable);
        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCompanyHeader(Document document) throws DocumentException {
        Paragraph header = new Paragraph("Guardian Life Assurance - Agent Earnings Report", HEADER_FONT);
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
