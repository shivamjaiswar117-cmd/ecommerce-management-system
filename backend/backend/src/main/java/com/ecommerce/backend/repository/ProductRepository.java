package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    // Search products by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products by category ID
    List<Product> findByCategoryId(Long categoryId);

    // Search products by name and category ID
    List<Product> findByNameContainingIgnoreCaseAndCategoryId(
            String name,
            Long categoryId
    );

    // Find products within a price range
    List<Product> findByPriceBetween(
            Double minPrice,
            Double maxPrice
    );

    // Sort products by price
    List<Product> findAllByOrderByPriceAsc();

    List<Product> findAllByOrderByPriceDesc();
}