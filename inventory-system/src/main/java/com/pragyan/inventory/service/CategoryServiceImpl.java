package com.pragyan.inventory.service;

import com.pragyan.inventory.dao.CategoryRepository;
import com.pragyan.inventory.entity.Category;
import com.pragyan.inventory.exception.ProductNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Did not find category id - " + id));
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ProductNotFoundException("Did not find category id - " + id);
        }
        categoryRepository.deleteById(id);
    }
}