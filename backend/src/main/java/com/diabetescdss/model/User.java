package com.diabetescdss.model;

import com.diabetescdss.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String address;

    private Double height; // cm
    private Double weight; // kg
    private Double bmi;    // calculated

    @Column(length = 1000)
    private String medicalHistory;

    @Column(length = 500)
    private String familyHistory;

    private String emergencyContact;

    private java.time.LocalDate dob;
    private String gender;

    public Integer getAge() {
        if (this.dob == null) return null;
        return java.time.Period.between(this.dob, java.time.LocalDate.now()).getYears();
    }

    @Builder.Default
    private boolean enabled = true;
    @Builder.Default
    private boolean emailVerified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<RoleEntity> roles = new HashSet<>();

    // Convenience method
    public boolean hasRole(Role role) {
        return roles.stream().anyMatch(r -> r.getName().equals(role.name()));
    }
}