package com.pragyan.inventory.rest;

import com.pragyan.inventory.dao.ProductRepository;
import com.pragyan.inventory.dto.CategoryWithCount;
import com.pragyan.inventory.entity.Category;
import com.pragyan.inventory.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryRestController {

    private final CategoryService categoryService;
    private final ProductRepository productRepository;

    public CategoryRestController(CategoryService categoryService, ProductRepository productRepository) {
        this.categoryService = categoryService;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @GetMapping("/with-counts")
    public List<CategoryWithCount> findAllWithCounts() {
        return categoryService.findAll().stream()
                .map(c -> CategoryWithCount.builder()
                        .id(c.getId())
                        .categoryName(c.getCategoryName())
                        .productCount(productRepository.countByCategoryId(c.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Category findById(@PathVariable Long id) {
        return categoryService.findById(id);
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        category.setId(null);
        return categoryService.save(category);
    }

    @PutMapping
    public Category update(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        categoryService.deleteById(id);
        return "Deleted category id - " + id;
    }
}