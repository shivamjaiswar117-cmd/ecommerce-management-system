package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.User;

import java.util.List;

public interface UserService {

    User registerUser(User user);

    List<User> getAllUsers();

    User updateUserRole(Long userId, String role);

}