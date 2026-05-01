package com.pragyan.inventory.service;

import com.pragyan.inventory.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> findAll();
    Category findById(Long id);
    Category save(Category category);
    void deleteById(Long id);
}