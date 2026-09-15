package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;

import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;

import com.ecommerce.backend.service.OrderService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.repository.AddressRepository;
import java.util.List;
@Service
public class OrderServiceImpl implements OrderService {

   private final OrderRepository orderRepository;
private final UserRepository userRepository;
private final CartRepository cartRepository;
private final OrderItemRepository orderItemRepository;
private final ProductRepository productRepository;
private final AddressRepository addressRepository;

    public OrderServiceImpl(
        OrderRepository orderRepository,
        UserRepository userRepository,
        CartRepository cartRepository,
        OrderItemRepository orderItemRepository,
        ProductRepository productRepository,
        AddressRepository addressRepository) {

    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.cartRepository = cartRepository;
    this.orderItemRepository = orderItemRepository;
    this.productRepository = productRepository;
    this.addressRepository = addressRepository;
}

  @Override
@Transactional
public Order createOrder(Long userId, Long addressId) {

    // 1. Find user
    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    // 2. Find selected address
    Address address = addressRepository.findById(addressId)
            .orElseThrow(() ->
                    new RuntimeException("Address not found"));

    // Check that address belongs to the user
    if (!address.getUser().getId().equals(userId)) {
        throw new RuntimeException("Address does not belong to this user");
    }

    // 3. Get user's cart
    List<Cart> cartItems = cartRepository.findByUser(user);

    // 4. Check if cart is empty
    if (cartItems.isEmpty()) {
        throw new RuntimeException("Cart is empty");
    }

    // 5. Check stock and calculate total
    double totalAmount = 0.0;

    for (Cart cart : cartItems) {

        int availableStock = cart.getProduct().getQuantity();
        int requestedQuantity = cart.getQuantity();

        // Check stock
        if (requestedQuantity > availableStock) {
            throw new RuntimeException(
                    "Insufficient stock for product: "
                    + cart.getProduct().getName()
            );
        }

        double price = cart.getProduct().getPrice();

        totalAmount += price * requestedQuantity;
    }

    // 6. Create Order
    Order order = new Order(
            user,
            totalAmount,
            OrderStatus.PLACED,
            LocalDateTime.now()
    );

    // Attach selected address
    order.setAddress(address);

    // 7. Save Order
    Order savedOrder = orderRepository.save(order);

    // 8. Create OrderItems and reduce stock
    for (Cart cart : cartItems) {

        double price = cart.getProduct().getPrice();
        int quantity = cart.getQuantity();

        // Create OrderItem
        OrderItem orderItem = new OrderItem(
                savedOrder,
                cart.getProduct(),
                quantity,
                price
        );

        // Add item to Order
        savedOrder.addOrderItem(orderItem);

        // Save OrderItem
        orderItemRepository.save(orderItem);

        // Reduce product stock
        int newStock = cart.getProduct().getQuantity() - quantity;

        cart.getProduct().setQuantity(newStock);

        productRepository.save(cart.getProduct());
    }

    // 9. Clear cart
    cartRepository.deleteAll(cartItems);

    // 10. Return order
    return savedOrder;
}
@Override
public List<Order> getOrdersByUser(Long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    return orderRepository.findByUser(user);
}

@Override
public Order getOrderById(Long orderId) {

    return orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new RuntimeException("Order not found"));
}

@Override
public Order updateOrderStatus(Long orderId, String status) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    OrderStatus newStatus;

    try {
        newStatus = OrderStatus.valueOf(status.toUpperCase());
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid order status");
    }

    OrderStatus currentStatus = order.getStatus();

    // PLACED → PROCESSING
    if (currentStatus == OrderStatus.PLACED
            && newStatus != OrderStatus.PROCESSING
            && newStatus != OrderStatus.CANCELLED) {

        throw new RuntimeException(
                "Order can only move to PROCESSING or CANCELLED"
        );
    }

    // PROCESSING → SHIPPED
    if (currentStatus == OrderStatus.PROCESSING
            && newStatus != OrderStatus.SHIPPED
            && newStatus != OrderStatus.CANCELLED) {

        throw new RuntimeException(
                "Order can only move to SHIPPED or CANCELLED"
        );
    }

    // SHIPPED → DELIVERED
    if (currentStatus == OrderStatus.SHIPPED
            && newStatus != OrderStatus.DELIVERED) {

        throw new RuntimeException(
                "Shipped order can only move to DELIVERED"
        );
    }

    // DELIVERED cannot be changed
    if (currentStatus == OrderStatus.DELIVERED) {

        throw new RuntimeException(
                "Delivered order status cannot be changed"
        );
    }

    order.setStatus(newStatus);

    return orderRepository.save(order);
}


// Cancel Order
@Override
@Transactional
public Order cancelOrder(Long orderId) {

    // 1. Find the order
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new RuntimeException("Order not found"));

    // 2. Check if order is already cancelled
    if (order.getStatus() == OrderStatus.CANCELLED) {
        throw new RuntimeException("Order is already cancelled");
    }

    // 3. Delivered orders cannot be cancelled
    if (order.getStatus() == OrderStatus.DELIVERED) {
        throw new RuntimeException("Delivered order cannot be cancelled");
    }

    // 4. Find all OrderItems belonging to this order
    List<OrderItem> orderItems =
            orderItemRepository.findByOrder(order);

    // 5. Restore product stock
    for (OrderItem orderItem : orderItems) {

        Product product = orderItem.getProduct();

        int currentStock = product.getQuantity();
        int orderedQuantity = orderItem.getQuantity();

                product.setQuantity(currentStock + orderedQuantity);

        productRepository.save(product);
    }

    // 6. Change order status
   order.setStatus(OrderStatus.CANCELLED);

    // 7. Save the order
    return orderRepository.save(order);
}
@Override
public List<Order> getAllOrders() {
    return orderRepository.findAll();
}
}