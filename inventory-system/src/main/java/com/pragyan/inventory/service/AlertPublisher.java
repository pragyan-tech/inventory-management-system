package com.pragyan.inventory.service;

import com.pragyan.inventory.dto.LowStockAlert;
import com.pragyan.inventory.entity.Product;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AlertPublisher {

    private static final String LOW_STOCK_TOPIC = "/topic/alerts/low-stock";

    private final SimpMessagingTemplate messagingTemplate;

    public AlertPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishLowStockAlert(Product product, int threshold) {
        String severity = product.getUnitsInStock() == 0 ? "OUT_OF_STOCK" : "LOW_STOCK";

        LowStockAlert alert = LowStockAlert.builder()
                .productId(product.getId())
                .productName(product.getName())
                .productSku(product.getSku())
                .currentStock(product.getUnitsInStock())
                .threshold(threshold)
                .severity(severity)
                .timestamp(Instant.now())
                .build();

        messagingTemplate.convertAndSend(LOW_STOCK_TOPIC, alert);
    }
}