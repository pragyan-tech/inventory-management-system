package com.pragyan.inventory.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {


    public String getUid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName(); // FirebaseAuthFilter sets this to UID
    }


    public String getEmail() {
        String uid = getUid();
        if ("system".equals(uid)) {
            return "system";
        }
        try {
            UserRecord user = FirebaseAuth.getInstance().getUser(uid);
            return user.getEmail();
        } catch (FirebaseAuthException e) {
            return uid; // fallback to UID if we can't get email
        }
    }
}