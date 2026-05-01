package com.pragyan.inventory.dao;

import com.pragyan.inventory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}