package com.pragyan.inventory.rest;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    @PostMapping("/set-role")
    public ResponseEntity<?> setUserRole(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.get("role");

        if (email == null || role == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and role are required"));
        }


        if (!role.equals("EMPLOYEE") && !role.equals("MANAGER") && !role.equals("ADMIN")) {
            return ResponseEntity.badRequest().body(Map.of("error", "role must be EMPLOYEE, MANAGER, or ADMIN"));
        }

        try {
            UserRecord user = FirebaseAuth.getInstance().getUserByEmail(email);

            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);
            FirebaseAuth.getInstance().setCustomUserClaims(user.getUid(), claims);

            return ResponseEntity.ok(Map.of(
                    "message", "Role set successfully",
                    "uid", user.getUid(),
                    "email", email,
                    "role", role,
                    "note", "User must sign out and back in for the role to take effect"
            ));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/user-role")
    public ResponseEntity<?> getUserRole(@RequestParam String email) {
        try {
            UserRecord user = FirebaseAuth.getInstance().getUserByEmail(email);
            Map<String, Object> claims = user.getCustomClaims();
            String role = claims != null && claims.get("role") != null
                    ? claims.get("role").toString()
                    : "EMPLOYEE (default)";

            return ResponseEntity.ok(Map.of(
                    "email", email,
                    "uid", user.getUid(),
                    "role", role
            ));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}