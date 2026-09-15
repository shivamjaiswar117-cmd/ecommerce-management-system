package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Wishlist;

import java.util.List;

public interface WishlistService {

    Wishlist addToWishlist(Long userId, Long productId);

    List<Wishlist> getWishlist(Long userId);

    void removeFromWishlist(Long wishlistId);
}