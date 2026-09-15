package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;

import java.util.List;

public interface OrderService {

    Order createOrder(Long userId, Long addressId);

    List<Order> getOrdersByUser(Long userId);

    Order getOrderById(Long orderId);

    Order updateOrderStatus(Long orderId, String status);

    Order cancelOrder(Long orderId);

    List<Order> getAllOrders();
}