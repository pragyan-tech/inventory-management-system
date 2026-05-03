package com.pragyan.inventory.dao;

import com.pragyan.inventory.dto.CategoryStockProjection;
import com.pragyan.inventory.dto.TopProductProjection;
import com.pragyan.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            " LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.unitsInStock <= :threshold ORDER BY p.unitsInStock ASC")
    List<Product> findLowStock(@Param("threshold") int threshold);

    @Query("SELECT COALESCE(SUM(p.unitPrice * p.unitsInStock), 0) FROM Product p")
    BigDecimal calculateTotalInventoryValue();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.unitsInStock <= :threshold")
    long countLowStock(@Param("threshold") int threshold);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.unitsInStock = 0")
    long countOutOfStock();

    @Query("""
    SELECT c.categoryName AS categoryName,
           COUNT(p) AS productCount,
           SUM(p.unitsInStock) AS totalUnits
    FROM Product p
    JOIN p.category c
    GROUP BY c.id, c.categoryName
    ORDER BY totalUnits DESC
    """)
    List<CategoryStockProjection> findStockByCategory();

    @Query("""
    SELECT p.id AS id,
           p.name AS name,
           p.sku AS sku,
           p.imageUrl AS imageUrl,
           p.unitsInStock AS unitsInStock,
           p.unitPrice AS unitPrice,
           (p.unitPrice * p.unitsInStock) AS inventoryValue
    FROM Product p
    WHERE p.unitsInStock > 0
    ORDER BY (p.unitPrice * p.unitsInStock) DESC
    LIMIT 10
    """)
    List<TopProductProjection> findTopProductsByValue();
}