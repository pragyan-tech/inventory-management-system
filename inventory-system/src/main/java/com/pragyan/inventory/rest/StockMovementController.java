package com.pragyan.inventory.rest;

import com.pragyan.inventory.dto.StockMovementResponse;
import com.pragyan.inventory.entity.StockMovement;
import com.pragyan.inventory.service.StockMovementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public Page<StockMovementResponse> findAll(Pageable pageable) {
        Page<StockMovement> page = stockMovementService.findAll(pageable);
        return page.map(StockMovementResponse::from);
    }

    @GetMapping("/product/{productId}")
    public Page<StockMovementResponse> findByProduct(
            @PathVariable Long productId,
            Pageable pageable
    ) {
        Page<StockMovement> page = stockMovementService.findByProductId(productId, pageable);
        return page.map(StockMovementResponse::from);
    }
}