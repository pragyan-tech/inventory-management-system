package com.pragyan.inventory.service;

import com.pragyan.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product> findAll(String search, Pageable pageable);
    Product findById(Long id);
    Product save(Product product);
    void deleteById(Long id);
}