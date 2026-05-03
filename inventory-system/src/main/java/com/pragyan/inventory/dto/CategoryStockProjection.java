package com.pragyan.inventory.dto;

public interface CategoryStockProjection {
    String getCategoryName();
    Long getProductCount();
    Long getTotalUnits();
}