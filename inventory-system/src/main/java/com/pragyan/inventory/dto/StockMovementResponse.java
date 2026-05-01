package com.pragyan.inventory.dto;

import com.pragyan.inventory.entity.MovementType;
import com.pragyan.inventory.entity.StockMovement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private MovementType movementType;
    private Integer quantityChange;
    private Integer stockAfter;
    private String reason;
    private String performedByEmail;
    private Date createdAt;

    public static StockMovementResponse from(StockMovement m) {
        return StockMovementResponse.builder()
                .id(m.getId())
                .productId(m.getProduct() != null ? m.getProduct().getId() : null)
                .productName(m.getProduct() != null ? m.getProduct().getName() : null)
                .productSku(m.getProduct() != null ? m.getProduct().getSku() : null)
                .movementType(m.getMovementType())
                .quantityChange(m.getQuantityChange())
                .stockAfter(m.getStockAfter())
                .reason(m.getReason())
                .performedByEmail(m.getPerformedByEmail())
                .createdAt(m.getCreatedAt())
                .build();
    }
}