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
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;
import com.monocept.myapp.dto.PaymentResponseDto;

@Service
public class PaymentReportService {

    private static final Font BOLD_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
    private static final Font REGULAR_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.NORMAL);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.BOLD, BaseColor.BLUE);
    private static final Font WATERMARK_FONT = new Font(Font.FontFamily.HELVETICA, 52, Font.BOLD, BaseColor.LIGHT_GRAY);
    private static final BaseColor HEADER_BG_COLOR = new BaseColor(230, 230, 250);

    public ByteArrayInputStream generatePaymentReport(List<PaymentResponseDto> payments) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = PdfWriter.getInstance(document, out);
        writer.setPageEvent(new HeaderFooterPageEvent());
        document.open();

        addWatermark(writer);
        addCompanyHeader(document);

        addPaymentTable(document, payments);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCompanyHeader(Document document) throws DocumentException {
        Paragraph header = new Paragraph("Guardian Life Assurance - Payment Report", HEADER_FONT);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(new Paragraph("Report generated on: " + LocalDateTime.now(), REGULAR_FONT));
        document.add(new Paragraph(" "));
    }

    private void addPaymentTable(Document document, List<PaymentResponseDto> payments) throws DocumentException {
        PdfPTable paymentTable = new PdfPTable(5);
        paymentTable.setWidthPercentage(100);
        paymentTable.setSpacingBefore(10f);
        paymentTable.setSpacingAfter(10f);
        paymentTable.setWidths(new int[]{10, 20, 20, 20, 20});

        addTableHeader(paymentTable, "Payment ID", "Amount", "Policy No", "Status", "Payment Date");

        for (PaymentResponseDto payment : payments) {
            addRow(paymentTable,
                    String.valueOf(payment.getPaymentId()),
                    String.valueOf(payment.getAmount()),
                    String.valueOf(payment.getPolicyNo()),
                    payment.getStatus().toString(),
                    payment.getPaymentDate().toString());
        }
        document.add(paymentTable);
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
        boolean isEvenRow = table.getRows().size() % 2 == 0;
        BaseColor backgroundColor = isEvenRow ? BaseColor.WHITE : new BaseColor(245, 245, 245);

        for (String value : values) {
            PdfPCell cell = new PdfPCell();
            cell.setPhrase(new Phrase(value, REGULAR_FONT));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            cell.setBackgroundColor(backgroundColor);
            table.addCell(cell);
        }
    }

    private void addWatermark(PdfWriter writer) {
        PdfContentByte canvas = writer.getDirectContentUnder();
        Phrase watermark = new Phrase("CONFIDENTIAL", WATERMARK_FONT);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, watermark, 297.5f, 421, 45);
    }

    class HeaderFooterPageEvent extends PdfPageEventHelper {

        @Override
        public void onStartPage(PdfWriter writer, Document document) {
            try {
                PdfPTable header = new PdfPTable(1);
                header.setWidthPercentage(100);
                PdfPCell cell = new PdfPCell(new Phrase("Payment Report - Guardian Life Assurance", HEADER_FONT));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBorder(Rectangle.NO_BORDER);
                header.addCell(cell);
                document.add(header);
                document.add(new Paragraph(" "));
            } catch (DocumentException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(1);
            footer.setTotalWidth(527);
            footer.setLockedWidth(true);
            footer.getDefaultCell().setFixedHeight(30);
            footer.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
            footer.addCell(new Phrase(String.format("Page %d", writer.getPageNumber()), REGULAR_FONT));
            footer.writeSelectedRows(0, -1, 34, 30, writer.getDirectContent());
        }
    }
}
