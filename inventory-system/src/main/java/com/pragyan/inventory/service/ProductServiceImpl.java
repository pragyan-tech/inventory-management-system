package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository ProductRepository;
    @Autowired
    private ProductRepository productRepository;
    public ProductServiceImpl(ProductRepository productRepository) {
        this.ProductRepository = productRepository;
    }

    @Override
    public List<Product> findAll() {
        return ProductRepository.findAll();
    }

    @Override
    public Product findById(int id) {
        Optional<Product> result = productRepository.findById(id);

        Product theProduct = null;
        if (result.isPresent()) {
            theProduct = result.get();
        } else {
            throw new ProductNotFoundException("Did not find product id - " + id);
        }
        return theProduct;
    }

    
    @Override
    public Product save(Product product) {
        return ProductRepository.save(product);
    }

    @Override
    public void deleteById(int id) {
        ProductRepository.deleteById(id);
    }
}
