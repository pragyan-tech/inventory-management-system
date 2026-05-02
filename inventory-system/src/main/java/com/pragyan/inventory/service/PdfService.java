package com.pragyan.inventory.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.entity.Product;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    private final ProductRepository productRepository;

    private static final DeviceRgb HEADER_BG = new DeviceRgb(15, 23, 42);          // slate-900
    private static final DeviceRgb TABLE_HEADER_BG = new DeviceRgb(30, 41, 59);    // slate-800
    private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(241, 245, 249);      // slate-100
    private static final DeviceRgb RED = new DeviceRgb(220, 38, 38);
    private static final DeviceRgb YELLOW = new DeviceRgb(202, 138, 4);

    public PdfService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void generateLowStockReport(OutputStream out, int threshold) throws IOException {
        List<Product> lowStockProducts = productRepository.findLowStock(threshold);

        try (PdfWriter writer = new PdfWriter(out);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf, PageSize.A4)) {

            doc.setMargins(40, 40, 40, 40);

            doc.add(new Paragraph("Low Stock Report")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(HEADER_BG)
                    .setMarginBottom(4));

            // Subtitle / metadata
            String generatedAt = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a"));
            doc.add(new Paragraph("Generated " + generatedAt)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(2));
            doc.add(new Paragraph("Threshold: " + threshold + " units or fewer")
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20));

            int outOfStock = (int) lowStockProducts.stream().filter(p -> p.getUnitsInStock() == 0).count();
            int lowStock = lowStockProducts.size() - outOfStock;

            doc.add(new Paragraph(String.format(
                    "Total items: %d   |   Out of stock: %d   |   Low stock: %d",
                    lowStockProducts.size(), outOfStock, lowStock))
                    .setFontSize(11)
                    .setMarginBottom(20));

            if (lowStockProducts.isEmpty()) {
                doc.add(new Paragraph("All products are above the low-stock threshold.")
                        .setFontSize(12)
                        .setItalic()
                        .setMarginTop(20));
            } else {
                Table table = new Table(UnitValue.createPercentArray(new float[]{2, 4, 3, 2, 2}))
                        .setWidth(UnitValue.createPercentValue(100));

                addHeaderCell(table, "SKU");
                addHeaderCell(table, "Product Name");
                addHeaderCell(table, "Category");
                addHeaderCell(table, "Stock");
                addHeaderCell(table, "Unit Price");

                for (Product p : lowStockProducts) {
                    addCell(table, p.getSku() == null ? "—" : p.getSku());
                    addCell(table, p.getName());
                    addCell(table, p.getCategory() != null ? p.getCategory().getCategoryName() : "—");
                    addStockCell(table, p.getUnitsInStock());
                    addCell(table, "$" + p.getUnitPrice().toPlainString());
                }

                doc.add(table);
            }

            // Footer
            doc.add(new Paragraph("This report was generated automatically by the Inventory Management System.")
                    .setFontSize(8)
                    .setFontColor(ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30));
        }
    }

    private void addHeaderCell(Table table, String text) {
        Cell cell = new Cell()
                .add(new Paragraph(text).setFontColor(ColorConstants.WHITE).setBold())
                .setBackgroundColor(TABLE_HEADER_BG)
                .setPadding(8)
                .setBorder(Border.NO_BORDER);
        table.addHeaderCell(cell);
    }

    private void addCell(Table table, String text) {
        Cell cell = new Cell()
                .add(new Paragraph(text == null ? "" : text).setFontSize(10))
                .setPadding(8)
                .setBorder(new SolidBorder(LIGHT_GRAY, 0.5f));
        table.addCell(cell);
    }

    private void addStockCell(Table table, int stock) {
        DeviceRgb color = stock == 0 ? RED : YELLOW;
        Cell cell = new Cell()
                .add(new Paragraph(String.valueOf(stock))
                        .setFontColor(color)
                        .setBold()
                        .setFontSize(10))
                .setPadding(8)
                .setBorder(new SolidBorder(LIGHT_GRAY, 0.5f));
        table.addCell(cell);
    }
}