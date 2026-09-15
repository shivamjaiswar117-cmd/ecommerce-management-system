package com.ecommerce.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key (minimum 32 characters)
    private static final String SECRET =
            "mySecretKeyForJwtAuthentication123456789";

    private final Key key = Keys.hmacShaKeyFor(
        SECRET.getBytes(java.nio.charset.StandardCharsets.UTF_8)
);

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // Generate JWT Token
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Check Token Expiry
    public boolean isTokenValid(String token) {
        return !getClaims(token).getExpiration().before(new Date());
    }

    // Validate Token
public boolean validateToken(String token, String username) {
    return extractUsername(token).equals(username) && isTokenValid(token);
}

    // Extract Claims
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}