package com.stemlink.skillmentor.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {

    @Value("${admin.emails:}")
    private String adminEmails;

    @Value("${admin.user-ids:}")
    private String adminUserIds;

    private final TokenValidator tokenValidator;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && tokenValidator.validateToken(jwt)) {
                String userId = tokenValidator.extractUserId(jwt);
                List<String> roles = tokenValidator.extractRoles(jwt);
                String email = tokenValidator.extractEmail(jwt);
                log.debug("Extracted from token - userId: {}, email: {}", userId, email);

                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                if (roles != null) {
                    roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .forEach(authorities::add);
                }

                // Check Admin role - by email (requires email in JWT claim)
                List<String> adminEmailList = Arrays.stream(adminEmails.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).toList();
                boolean isAdmin = email != null && adminEmailList.contains(email.trim());

                // Fallback: Check Admin role by Clerk user ID (always present in JWT 'sub')
                if (!isAdmin && userId != null && !adminUserIds.isBlank()) {
                    List<String> adminUserIdList = Arrays.stream(adminUserIds.split(","))
                            .map(String::trim).filter(s -> !s.isEmpty()).toList();
                    isAdmin = adminUserIdList.contains(userId.trim());
                }

                log.debug("Auth check - userId: {}, email: {}, isAdmin: {}", userId, email, isAdmin);
                
                boolean hasAdminRole = authorities.stream().anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
                
                if (hasAdminRole || isAdmin) {
                    if (authorities.stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    }
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("SecurityContext set for user: {} with authorities: {}", userId, authorities);
            } else {
                if (jwt == null) {
                    log.debug("No JWT token found in 'Authorization' header for request: {}", request.getRequestURI());
                } else {
                    log.warn("JWT token validation failed for request: {}", request.getRequestURI());
                }
            }
        } catch (Exception e) {
            log.error("Authentication filter error: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}

