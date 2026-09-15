package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addToWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId) {

        return ResponseEntity.ok(
                wishlistService.addToWishlist(userId, productId)
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                wishlistService.getWishlist(userId)
        );
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long wishlistId) {

        wishlistService.removeFromWishlist(wishlistId);

        return ResponseEntity.ok("Product removed from wishlist");
    }
}