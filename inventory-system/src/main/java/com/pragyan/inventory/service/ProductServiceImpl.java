package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.exception.ProductNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
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
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Did not find product id - " + id);
        }
        productRepository.deleteById(id);
    }
}