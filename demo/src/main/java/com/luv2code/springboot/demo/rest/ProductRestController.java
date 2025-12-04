package com.luv2code.springboot.demo.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.luv2code.springboot.demo.entity.Product;
import com.luv2code.springboot.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductRestController {
    private ProductService productService;
    private ObjectMapper objectMapper;

    @Autowired
    public ProductRestController(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }
    @GetMapping("/products")
    public List<Product> findAll(){return productService.findAll();}

    @GetMapping("/products/{productId}")
    public Product findById(@PathVariable int productId){
        Product theProduct = productService.findById(productId);
        if(theProduct ==null){
            throw new RuntimeException("Product not found");
        }
        return theProduct;
    }

    @PostMapping("/products")
    public Product theProduct(@RequestBody Product theProduct){
        theProduct.setId(null);
        Product dbProduct = productService.save(theProduct);
        return dbProduct;
    }

    @PutMapping("/products")
    public Product updateProduct(@RequestBody Product theProduct){
        Product dbProduct = productService.save(theProduct);
        return dbProduct;
    }

    @PatchMapping("/products/{productId}")
    public Product patchProduct(@PathVariable int productId,
                                 @RequestBody Map<String, Object> patchPayload) {

        Product tempProduct = productService.findById(productId);

       
        if (tempProduct == null) {
            throw new RuntimeException("Product id not found - " + productId);
        }

        if (patchPayload.containsKey("id")) {
            throw new RuntimeException("Product id not allowed in request body - " + productId);
        }

        Product patchedProduct = apply(patchPayload, tempProduct);

        Product dbProduct = productService.save(patchedProduct);

        return dbProduct;
    }

    private Product apply(Map<String, Object> patchPayload, Product tempProduct) {
        ObjectNode productNode = objectMapper.convertValue(tempProduct, ObjectNode.class);

        ObjectNode patchNode = objectMapper.convertValue(patchPayload, ObjectNode.class);

        productNode.setAll(patchNode);

        return objectMapper.convertValue(productNode, Product.class);
    }

    @DeleteMapping("/products/{productId}")
    public String deleteProduct(@PathVariable int productId) {

        Product tempProduct = productService.findById(productId);

        if (tempProduct == null) {
            throw new RuntimeException("Product id not found - " + productId);
        }

        productService.deleteById(productId);

        return "Deleted product id - " + productId;
    }
}
