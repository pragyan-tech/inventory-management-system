package com.luv2code.springboot.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class SecurityConfig {

    // 1. Tell Spring to use your JDBC (Database) users
    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        return new JdbcUserDetailsManager(dataSource);
    }

    // 2. Define the Rules (The Firewall)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(configurer ->
                configurer
                        // READ access: Everyone (Employees, Managers, Admins)
                        .requestMatchers(HttpMethod.GET, "/api/products").hasRole("EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/api/products/**").hasRole("EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").hasRole("EMPLOYEE")

                        // CREATE/UPDATE access: Managers and Admins only
                        .requestMatchers(HttpMethod.POST, "/api/products").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/products").hasRole("MANAGER")

                        // DELETE access: Admins ONLY
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
        );

        // Use HTTP Basic authentication
        http.httpBasic(Customizer.withDefaults());

        // Disable CSRF (Cross-Site Request Forgery) - essential for non-browser REST clients
        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}