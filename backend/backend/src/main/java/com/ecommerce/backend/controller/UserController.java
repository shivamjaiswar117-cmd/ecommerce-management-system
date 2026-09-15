package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
        System.out.println("✅ UserController Loaded");
    }

    @GetMapping("/test")
    public String test() {
        return "Working";
    }

   @GetMapping
public List<User> getAllUsers() {
    return userService.getAllUsers();
}

@PutMapping("/{userId}/role")
public User updateUserRole(@PathVariable Long userId, @RequestParam String role) {
    return userService.updateUserRole(userId, role);
}

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        System.out.println("========== REGISTER API ==========");
        System.out.println(user);
        System.out.println("==================================");

        return ResponseEntity.ok(userService.registerUser(user));
    }
}