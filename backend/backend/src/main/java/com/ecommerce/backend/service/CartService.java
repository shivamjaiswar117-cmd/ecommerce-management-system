package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Cart;

import java.util.List;

public interface CartService {

    Cart addToCart(Long userId, Long productId, Integer quantity);

    List<Cart> getCart(Long userId);

    Cart updateQuantity(Long cartId, Integer quantity);

    void removeFromCart(Long cartId);

    void clearCart(Long userId);
}