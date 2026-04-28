package com.pragyan.inventory.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pragyan.inventory.entity.Product;
import com.pragyan.inventory.exception.ProductNotFoundException;
import com.pragyan.inventory.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductRestController {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    public ProductRestController(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/products")
    public Page<Product> findAll(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return productService.findAll(search, pageable);
    }

    @GetMapping("/products/{productId}")
    public Product findById(@PathVariable Long productId) {
        return productService.findById(productId);
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product theProduct) {
        theProduct.setId(null);
        return productService.save(theProduct);
    }

    @PutMapping("/products")
    public Product updateProduct(@RequestBody Product theProduct) {
        return productService.save(theProduct);
    }

    @PatchMapping("/products/{productId}")
    public Product patchProduct(@PathVariable Long productId,
                                @RequestBody Map<String, Object> patchPayload) {

        Product tempProduct = productService.findById(productId);

        if (patchPayload.containsKey("id")) {
            throw new RuntimeException("Product id not allowed in request body - " + productId);
        }

        Product patchedProduct = apply(patchPayload, tempProduct);
        return productService.save(patchedProduct);
    }

    private Product apply(Map<String, Object> patchPayload, Product tempProduct) {
        ObjectNode productNode = objectMapper.convertValue(tempProduct, ObjectNode.class);
        ObjectNode patchNode = objectMapper.convertValue(patchPayload, ObjectNode.class);
        productNode.setAll(patchNode);
        return objectMapper.convertValue(productNode, Product.class);
    }

    @DeleteMapping("/products/{productId}")
    public String deleteProduct(@PathVariable Long productId) {
        productService.deleteById(productId);
        return "Deleted product id - " + productId;
    }
}