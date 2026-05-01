package com.pragyan.inventory.rest;

import com.pragyan.inventory.entity.Category;
import com.pragyan.inventory.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryRestController {

    private final CategoryService categoryService;

    public CategoryRestController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> findAll() {
        return categoryService.findAll();
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