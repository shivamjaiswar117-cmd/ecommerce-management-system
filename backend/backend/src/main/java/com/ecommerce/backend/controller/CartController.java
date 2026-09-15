package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

   @PostMapping("/add")
public Cart addToCart(@RequestParam Long userId,
                      @RequestParam Long productId,
                      @RequestParam Integer quantity) {

    System.out.println(">>> addToCart API called");

    return cartService.addToCart(userId, productId, quantity);
}

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {

        return cartService.getCart(userId);
    }

    @PutMapping("/{cartId}")
    public Cart updateQuantity(@PathVariable Long cartId,
                               @RequestParam Integer quantity) {

        return cartService.updateQuantity(cartId, quantity);
    }

    @DeleteMapping("/{cartId}")
    public String removeFromCart(@PathVariable Long cartId) {

        cartService.removeFromCart(cartId);

        return "Item removed from cart";
    }

    @DeleteMapping("/clear/{userId}")
    public String clearCart(@PathVariable Long userId) {

        cartService.clearCart(userId);

        return "Cart cleared successfully";
    }
}