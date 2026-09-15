package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.OrderItem;

import java.util.List;

public interface OrderItemService {

    OrderItem addOrderItem(
            Long orderId,
            Long productId,
            Integer quantity,
            Double price
    );

    List<OrderItem> getItemsByOrder(Long orderId);
}