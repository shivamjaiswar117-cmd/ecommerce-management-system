package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay")
    public Payment makePayment(
            @RequestParam Long orderId,
            @RequestParam String paymentMethod) {

        return paymentService.makePayment(
                orderId,
                paymentMethod
        );
    }

    @GetMapping("/order/{orderId}")
    public Payment getPaymentByOrder(
            @PathVariable Long orderId) {

        return paymentService.getPaymentByOrder(orderId);
    }
}