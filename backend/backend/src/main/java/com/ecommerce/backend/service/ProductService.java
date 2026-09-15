package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;

import java.util.List;
import org.springframework.data.domain.Page;

public interface ProductService {

    Product addProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    // Search products by name
    List<Product> searchProducts(String name);

    // Get products by category
    List<Product> getProductsByCategory(Long categoryId);

    // Search products by name and category
    List<Product> filterProducts(String name, Long categoryId);

    // Find products within a price range
    List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice);

    // Sort products by price: lowest to highest
    List<Product> getProductsSortedByPriceAsc();

    // Sort products by price: highest to lowest
    List<Product> getProductsSortedByPriceDesc();

    Page<Product> getProductsWithPagination(int page, int size);

    // Unified dynamic search/filter/sort/pagination
    Page<Product> listProducts(String name, Long categoryId, Double minPrice, Double maxPrice,
                                String sortBy, String sortDir, int page, int size);
}