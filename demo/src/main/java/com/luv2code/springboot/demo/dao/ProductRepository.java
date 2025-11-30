package com.luv2code.springboot.demo.dao;

import com.luv2code.springboot.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Integer> {

}
