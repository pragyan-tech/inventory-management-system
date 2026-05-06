package com.pragyan.inventory.dao;

import com.pragyan.inventory.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<StockMovement> findAllByOrderByCreatedAtDesc();

    @Query(
            value = "SELECT m FROM StockMovement m LEFT JOIN FETCH m.product",
            countQuery = "SELECT COUNT(m) FROM StockMovement m"
    )
    Page<StockMovement> findAllWithProduct(Pageable pageable);
    @Query(
            value = "SELECT m FROM StockMovement m LEFT JOIN FETCH m.product WHERE m.product.id = :productId",
            countQuery = "SELECT COUNT(m) FROM StockMovement m WHERE m.product.id = :productId"
    )
    Page<StockMovement> findByProductIdWithProduct(@Param("productId") Long productId, Pageable pageable);
}