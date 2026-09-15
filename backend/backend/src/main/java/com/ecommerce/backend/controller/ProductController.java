package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Add Product
    @PostMapping
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(product));
    }

    // Get All Products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Search Products By Name
@GetMapping("/search")
public ResponseEntity<List<Product>> searchProducts(
        @RequestParam String name) {

    return ResponseEntity.ok(productService.searchProducts(name));
}

// Get Products By Category
@GetMapping("/category/{categoryId}")
public ResponseEntity<List<Product>> getProductsByCategory(
        @PathVariable Long categoryId) {

    return ResponseEntity.ok(
            productService.getProductsByCategory(categoryId)
    );
}

// Get Products With Pagination
@GetMapping("/page")
public ResponseEntity<Page<Product>> getProductsWithPagination(
        @RequestParam int page,
        @RequestParam int size) {

    return ResponseEntity.ok(
            productService.getProductsWithPagination(page, size)
    );
}

// Unified dynamic search/filter/sort/pagination
@GetMapping("/list")
public ResponseEntity<Page<Product>> listProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false, defaultValue = "id") String sortBy,
        @RequestParam(required = false, defaultValue = "asc") String sortDir,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    return ResponseEntity.ok(
            productService.listProducts(name, categoryId, minPrice, maxPrice, sortBy, sortDir, page, size)
    );
}

    // Get Product By Id
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/filter")
public ResponseEntity<List<Product>> filterProducts(
        @RequestParam String name,
        @RequestParam Long categoryId) {

    return ResponseEntity.ok(
            productService.filterProducts(name, categoryId)
    );
}

    // Get Products By Price Range
@GetMapping("/price-range")
public ResponseEntity<List<Product>> getProductsByPriceRange(
        @RequestParam Double minPrice,
        @RequestParam Double maxPrice) {

    return ResponseEntity.ok(
            productService.getProductsByPriceRange(minPrice, maxPrice)
    );
}

    // Sort Products By Price - Ascending
@GetMapping("/sort/asc")
public ResponseEntity<List<Product>> getProductsSortedByPriceAsc() {
    return ResponseEntity.ok(
            productService.getProductsSortedByPriceAsc()
    );
}

// Sort Products By Price - Descending
@GetMapping("/sort/desc")
public ResponseEntity<List<Product>> getProductsSortedByPriceDesc() {
    return ResponseEntity.ok(
            productService.getProductsSortedByPriceDesc()
    );
}

    // Update Product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully.");
    }
}