package com.pragyan.inventory.service;

import com.pragyan.inventory.entity.MovementType;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockMovementService {


    StockMovement record(
            Product product,
            MovementType type,
            int quantityChange,
            int stockAfter,
            String reason
    );


    Page<StockMovement> findAll(Pageable pageable);
    
    Page<StockMovement> findByProductId(Long productId, Pageable pageable);
}