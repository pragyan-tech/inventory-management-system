package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.entity.MovementType;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.exception.ProductNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StockMovementService stockMovementService;

    public ProductServiceImpl(
            ProductRepository productRepository,
            StockMovementService stockMovementService
    ) {
        this.productRepository = productRepository;
        this.stockMovementService = stockMovementService;
    }

    @Override
    public Page<Product> findAll(String search, Pageable pageable) {
        return productRepository.searchProducts(search, pageable);
    }

    @Override
    public Product findById(Long id) {
        Optional<Product> result = productRepository.findById(id);
        return result.orElseThrow(() ->
                new ProductNotFoundException("Did not find product id - " + id));
    }

    @Override
    @Transactional
    public Product save(Product product) {
        boolean isNew = product.getId() == null;
        int oldStock = 0;

        if (!isNew) {
            // Existing product — fetch current stock to calculate delta
            Product existing = findById(product.getId());
            oldStock = existing.getUnitsInStock();
        }

        Product saved = productRepository.save(product);
        int newStock = saved.getUnitsInStock();
        int delta = newStock - oldStock;

        // Record a movement only if it's new OR stock actually changed
        if (isNew) {
            stockMovementService.record(
                    saved,
                    MovementType.INITIAL,
                    newStock,
                    newStock,
                    "Product created"
            );
        } else if (delta != 0) {
            MovementType type = delta > 0 ? MovementType.STOCK_IN : MovementType.STOCK_OUT;
            stockMovementService.record(
                    saved,
                    type,
                    delta,
                    newStock,
                    "Stock adjusted via update"
            );
        }
        // If delta == 0 (e.g., name change but stock unchanged), we don't log a movement
        // This is a design choice — see notes below

        return saved;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Did not find product id - " + id);
        }
        productRepository.deleteById(id);
        // Movements are cascade-deleted by the FK constraint
        // For richer audit trails, we'd implement soft delete instead
    }
    }
