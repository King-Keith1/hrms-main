package com.company.hrms.security;

import com.company.hrms.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service // Spring-managed service for JWT generation and validation
public class JwtService {

    @Value("${jwt.secret}") // Secret key from application properties
    private String secret;

    @Value("${jwt.expiration}") // Expiration time in milliseconds
    private long expiration;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername()) // JWT subject = username
                .claim("role", user.getRole().name()) // custom claim for role
                .setIssuedAt(new Date()) // current timestamp
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // token expiration
                .signWith(getKey(), SignatureAlgorithm.HS256) // sign with HMAC SHA-256
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey()) // validate signature
                .build()
                .parseClaimsJws(token) // parse signed token
                .getBody();
    }
}