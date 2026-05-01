package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.StockMovementRepository;
import com.pragyan.inventory.entity.MovementType;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.entity.StockMovement;
import com.pragyan.inventory.security.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StockMovementServiceImpl implements StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final CurrentUser currentUser;

    public StockMovementServiceImpl(
            StockMovementRepository stockMovementRepository,
            CurrentUser currentUser
    ) {
        this.stockMovementRepository = stockMovementRepository;
        this.currentUser = currentUser;
    }

    @Override
    public StockMovement record(
            Product product,
            MovementType type,
            int quantityChange,
            int stockAfter,
            String reason
    ) {
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setMovementType(type);
        movement.setQuantityChange(quantityChange);
        movement.setStockAfter(stockAfter);
        movement.setReason(reason);
        movement.setPerformedByUid(currentUser.getUid());
        movement.setPerformedByEmail(currentUser.getEmail());
        // createdAt is auto-populated by @CreationTimestamp

        return stockMovementRepository.save(movement);
    }

    @Override
    public Page<StockMovement> findAll(Pageable pageable) {
        return stockMovementRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Page<StockMovement> findByProductId(Long productId, Pageable pageable) {
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
    }
}