package com.pragyan.inventory.dao;

import com.pragyan.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}