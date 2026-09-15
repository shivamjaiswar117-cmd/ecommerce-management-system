package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String houseNo;

    private String street;

    private String city;

    private String state;

    private String pincode;

    private String addressType;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}