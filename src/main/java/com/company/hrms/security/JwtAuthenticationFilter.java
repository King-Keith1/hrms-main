package com.company.hrms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;

import java.util.List;

@Component // Spring-managed filter
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService; // Service for extracting and validating JWT

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/api-docs");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws java.io.IOException, jakarta.servlet.ServletException {

        String authHeader = request.getHeader("Authorization");

        // If no Bearer token, skip authentication
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            Claims claims = jwtService.extractClaims(token); // Extract claims from JWT

            String username = claims.getSubject(); // JWT subject (username)
            String role = claims.get("role", String.class); // JWT role

            Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();

            // Only set authentication if username & role exist and no prior auth
            if (username != null &&
                    role != null &&
                    (existingAuth == null ||
                            !existingAuth.isAuthenticated() ||
                            existingAuth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {

                // Map role from JWT to Spring Security authority
                var authority = new SimpleGrantedAuthority(role);

                // Build Authentication object
                var auth = new UsernamePasswordAuthenticationToken(
                        username,
                        null, // no credentials needed (already validated)
                        List.of(authority)
                );

                // Set authentication in SecurityContext for downstream security checks
                SecurityContextHolder.getContext().setAuthentication(auth);

                // DEBUG: log successful authentication
                System.out.println("=== JWT Authenticated user: " + username + " with role: " + role);
            }

        } catch (JwtException e) {
            // Invalid token -> log and continue request as unauthenticated
            System.out.println("JWT ERROR: " + e.getMessage());
        }

        filterChain.doFilter(request, response); // Continue filter chain
    }
}