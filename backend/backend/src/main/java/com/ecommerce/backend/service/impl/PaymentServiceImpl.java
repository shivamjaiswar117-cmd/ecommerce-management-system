package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.PaymentRepository;
import com.ecommerce.backend.service.PaymentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public Payment makePayment(
            Long orderId,
            String paymentMethod) {

        // Find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // Check if payment already exists
        if (paymentRepository.findByOrder(order).isPresent()) {
            throw new RuntimeException(
                    "Payment already exists for this order");
        }

        // Create payment
        Payment payment = new Payment(
                order,
                order.getTotalAmount(),
                paymentMethod,
                "PAID",
                LocalDateTime.now()
        );

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        return paymentRepository.findByOrder(order)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }
}