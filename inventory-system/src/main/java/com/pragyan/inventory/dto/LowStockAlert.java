package com.pragyan.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockAlert {
    private Long productId;
    private String productName;
    private String productSku;
    private Integer currentStock;
    private Integer threshold;
    private String severity;       // "OUT_OF_STOCK"
    private Instant timestamp;
}