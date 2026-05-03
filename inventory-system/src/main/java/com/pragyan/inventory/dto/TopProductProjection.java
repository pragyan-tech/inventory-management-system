package com.pragyan.inventory.dto;

import java.math.BigDecimal;

public interface TopProductProjection {
    Long getId();
    String getName();
    String getSku();
    String getImageUrl();
    Integer getUnitsInStock();
    BigDecimal getUnitPrice();
    BigDecimal getInventoryValue();
}