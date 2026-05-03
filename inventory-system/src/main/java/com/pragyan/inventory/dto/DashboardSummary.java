package com.pragyan.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private long totalProducts;
    private BigDecimal totalInventoryValue;
    private long lowStockCount;
    private long outOfStockCount;
    private long totalCategories;
}