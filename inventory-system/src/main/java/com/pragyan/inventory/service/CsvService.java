package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.CategoryRepository;
import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.dto.CsvImportResponse;
import com.pragyan.inventory.entity.Category;
import com.pragyan.inventory.entity.MovementType;
import com.pragyan.inventory.entity.Product;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CsvService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementService stockMovementService;

    public CsvService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            StockMovementService stockMovementService
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockMovementService = stockMovementService;
    }


    public void exportProducts(Writer writer) throws IOException {
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader("sku", "name", "description", "unit_price", "units_in_stock", "category_name")
                .build();

        try (CSVPrinter printer = new CSVPrinter(writer, format)) {
            List<Product> products = productRepository.findAll();
            for (Product p : products) {
                printer.printRecord(
                        p.getSku(),
                        p.getName(),
                        p.getDescription(),
                        p.getUnitPrice(),
                        p.getUnitsInStock(),
                        p.getCategory() != null ? p.getCategory().getCategoryName() : ""
                );
            }
        }
    }


    public CsvImportResponse importProducts(Reader reader) throws IOException {

        Map<String, Category> categoryMap = new HashMap<>();
        for (Category cat : categoryRepository.findAll()) {
            categoryMap.put(cat.getCategoryName().toLowerCase(), cat);
        }

        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setTrim(true)
                .build();

        List<CsvImportResponse.RowError> errors = new ArrayList<>();
        int successCount = 0;
        int totalRows = 0;

        Iterable<CSVRecord> records = format.parse(reader);

        for (CSVRecord record : records) {
            totalRows++;
            int rowNumber = (int) record.getRecordNumber() + 1; // +1 because header was row 1
            String sku = null;

            try {
                sku = record.get("sku");
                String name = record.get("name");
                String description = record.get("description");
                String unitPriceStr = record.get("unit_price");
                String unitsInStockStr = record.get("units_in_stock");
                String categoryName = record.get("category_name");


                if (sku == null || sku.isBlank()) {
                    throw new IllegalArgumentException("SKU is required");
                }
                if (name == null || name.isBlank()) {
                    throw new IllegalArgumentException("Name is required");
                }

                // Parse numbers with friendly errors
                BigDecimal unitPrice;
                try {
                    unitPrice = new BigDecimal(unitPriceStr);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid unit_price: " + unitPriceStr);
                }
                if (unitPrice.signum() < 0) {
                    throw new IllegalArgumentException("unit_price cannot be negative");
                }

                int unitsInStock;
                try {
                    unitsInStock = Integer.parseInt(unitsInStockStr);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid units_in_stock: " + unitsInStockStr);
                }
                if (unitsInStock < 0) {
                    throw new IllegalArgumentException("units_in_stock cannot be negative");
                }


                Category category = categoryMap.get(categoryName.toLowerCase());
                if (category == null) {
                    throw new IllegalArgumentException("Category not found: " + categoryName);
                }

                // Save (transactionally per row)
                saveImportedProduct(sku, name, description, unitPrice, unitsInStock, category);
                successCount++;

            } catch (Exception e) {
                errors.add(CsvImportResponse.RowError.builder()
                        .rowNumber(rowNumber)
                        .sku(sku)
                        .error(e.getMessage())
                        .build());
            }
        }

        return CsvImportResponse.builder()
                .totalRows(totalRows)
                .successCount(successCount)
                .errorCount(errors.size())
                .errors(errors)
                .build();
    }


    @Transactional
    public void saveImportedProduct(
            String sku, String name, String description,
            BigDecimal unitPrice, int unitsInStock, Category category
    ) {
        Optional<Product> existing = productRepository.findAll().stream()
                .filter(p -> sku.equals(p.getSku()))
                .findFirst();

        Product product;
        boolean isNew = existing.isEmpty();
        int oldStock = 0;

        if (isNew) {
            product = new Product();
            product.setSku(sku);
        } else {
            product = existing.get();
            oldStock = product.getUnitsInStock();
        }

        product.setName(name);
        product.setDescription(description);
        product.setUnitPrice(unitPrice);
        product.setUnitsInStock(unitsInStock);
        product.setCategory(category);

        Product saved = productRepository.save(product);

        if (isNew) {
            stockMovementService.record(saved, MovementType.BULK_IMPORT, unitsInStock, unitsInStock,
                    "Created via CSV import");
        } else {
            int delta = unitsInStock - oldStock;
            if (delta != 0) {
                stockMovementService.record(saved, MovementType.BULK_IMPORT, delta, unitsInStock,
                        "Updated via CSV import");
            }
        }
    }
}