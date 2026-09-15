package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.service.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping("/add")
    public OrderItem addOrderItem(
            @RequestParam Long orderId,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam Double price) {

        return orderItemService.addOrderItem(
                orderId,
                productId,
                quantity,
                price
        );
    }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getItemsByOrder(
            @PathVariable Long orderId) {

        return orderItemService.getItemsByOrder(orderId);
    }
}