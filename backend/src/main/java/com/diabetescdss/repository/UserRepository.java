package com.diabetescdss.repository;

import com.diabetescdss.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Admin search: find users by email containing a string (case‑insensitive)
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
    long countByEnabled(boolean enabled);
}