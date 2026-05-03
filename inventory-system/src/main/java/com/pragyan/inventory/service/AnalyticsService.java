package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.CategoryRepository;
import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.dto.CategoryStockProjection;
import com.pragyan.inventory.dto.DashboardSummary;
import com.pragyan.inventory.dto.TopProductProjection;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AnalyticsService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AnalyticsService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public DashboardSummary getDashboardSummary() {
        long totalProducts = productRepository.count();
        BigDecimal totalValue = productRepository.calculateTotalInventoryValue();
        long lowStock = productRepository.countLowStock(LOW_STOCK_THRESHOLD);
        long outOfStock = productRepository.countOutOfStock();
        long totalCategories = categoryRepository.count();

        return DashboardSummary.builder()
                .totalProducts(totalProducts)
                .totalInventoryValue(totalValue)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .totalCategories(totalCategories)
                .build();
    }
    public List<CategoryStockProjection> getStockByCategory() {
        return productRepository.findStockByCategory();
    }

    public List<TopProductProjection> getTopProductsByValue() {
        return productRepository.findTopProductsByValue();
    }
}