package com.pragyan.inventory.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final FirebaseAuthFilter firebaseAuthFilter;

    public SecurityConfig(FirebaseAuthFilter firebaseAuthFilter) {
        this.firebaseAuthFilter = firebaseAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/products/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**")
                        .hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**")
                        .hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/products/**")
                        .hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/categories/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**")
                        .hasAnyRole( "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**")
                        .hasAnyRole( "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**")
                        .hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/movements/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        // CSV operations
                        .requestMatchers(HttpMethod.GET, "/api/csv/export/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/csv/import/**")
                        .hasAnyRole("MANAGER", "ADMIN")
                        // PDF reports
                        .requestMatchers(HttpMethod.GET, "/api/pdf/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        // Analytics — read-only, all roles
                        .requestMatchers(HttpMethod.GET, "/api/analytics/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}