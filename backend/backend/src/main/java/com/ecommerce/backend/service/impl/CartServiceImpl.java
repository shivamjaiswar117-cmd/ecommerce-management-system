package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

   @Override
public Cart addToCart(Long userId, Long productId, Integer quantity) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    if (quantity <= 0) {
        throw new RuntimeException("Quantity must be greater than 0");
    }

    // Check if this product is already in the user's cart
    Cart existingCartItem = cartRepository.findByUserAndProduct(user, product).orElse(null);

    int totalRequestedQuantity = quantity + (existingCartItem != null ? existingCartItem.getQuantity() : 0);

    if (totalRequestedQuantity > product.getQuantity()) {
        throw new RuntimeException(
                "Insufficient stock. Available stock: " + product.getQuantity()
        );
    }

    if (existingCartItem != null) {
        existingCartItem.setQuantity(totalRequestedQuantity);
        return cartRepository.save(existingCartItem);
    }

    Cart cart = Cart.builder()
            .user(user)
            .product(product)
            .quantity(quantity)
            .build();

    return cartRepository.save(cart);
}

    @Override
    public List<Cart> getCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user);
    }

   @Override
public Cart updateQuantity(Long cartId, Integer quantity) {

    Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

    if (quantity <= 0) {
        throw new RuntimeException("Quantity must be greater than 0");
    }

    Product product = cart.getProduct();

    if (quantity > product.getQuantity()) {
        throw new RuntimeException(
                "Insufficient stock. Available stock: " + product.getQuantity()
        );
    }

    cart.setQuantity(quantity);

    return cartRepository.save(cart);
}

    @Override
    public void removeFromCart(Long cartId) {

        cartRepository.deleteById(cartId);
    }

    @Override
    public void clearCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Cart> cartItems = cartRepository.findByUser(user);

        cartRepository.deleteAll(cartItems);
    }
}