package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Payment;

public interface PaymentService {

    Payment makePayment(
            Long orderId,
            String paymentMethod
    );

    Payment getPaymentByOrder(Long orderId);
}