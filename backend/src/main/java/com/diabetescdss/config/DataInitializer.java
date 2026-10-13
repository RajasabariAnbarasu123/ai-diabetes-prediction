package com.diabetescdss.config;

import com.diabetescdss.model.RoleEntity;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.RoleRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        RoleEntity patientRole = seedRole("PATIENT");
        RoleEntity adminRole = seedRole("ADMIN");

        seedUser("patient@example.com", "patient123", "Patient User", patientRole);
        seedUser("admin@example.com", "admin123", "Admin User", adminRole);

        log.info("DataInitializer: roles and users seeded successfully.");
    }

    private RoleEntity seedRole(String roleName) {
        return roleRepository.findByName(roleName).orElseGet(() -> {
            RoleEntity role = roleRepository.save(RoleEntity.builder().name(roleName).build());
            log.info("DataInitializer: created role '{}'", roleName);
            return role;
        });
    }

    private void seedUser(String email, String rawPassword, String name, RoleEntity role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .name(name)
                    .dob(LocalDate.of(1990, 1, 1))
                    .gender("Male")
                    .enabled(true)
                    .emailVerified(true)
                    .roles(new HashSet<>(Set.of(role)))
                    .build();
            userRepository.save(user);
            log.info("DataInitializer: seeded user '{}' with role '{}'", email, role.getName());
        }
    }
}

