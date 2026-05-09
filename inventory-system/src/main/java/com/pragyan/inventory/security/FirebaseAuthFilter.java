package com.pragyan.inventory.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = authHeader.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            String role = (String) decodedToken.getClaims().getOrDefault("role", "EMPLOYEE");
            System.out.println("DEBUG: Request URI: " + request.getRequestURI() + " | Method: " + request.getMethod() + " | Role: " + role);



            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );


            System.out.println("DEBUG: User " + uid + " has role: " + role);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(uid, null, authorities);
            System.out.println("DEBUG: Setting authority: ROLE_" + role);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (FirebaseAuthException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);

    }
}