package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
public Order createOrder(
        @RequestParam Long userId,
        @RequestParam Long addressId) {

    return orderService.createOrder(userId, addressId);
}

    @PutMapping("/{orderId}/cancel")
public Order cancelOrder(@PathVariable Long orderId) {

    return orderService.cancelOrder(orderId);
}

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {

        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {

        return orderService.getOrderById(orderId);
    }

    @GetMapping("/all")
public List<Order> getAllOrders() {
    return orderService.getAllOrders();
}

     @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return orderService.updateOrderStatus(orderId, status);
    }
}