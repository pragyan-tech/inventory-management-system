package com.luv2code.springboot.demo.service;

import com.luv2code.springboot.demo.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> findAll();
    Product findById(int id);
    Product save(Product product);
    void deleteById(int id);
}
