package com.diabetescdss.model;

import com.diabetescdss.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // nullable for anonymous actions

    @Enumerated(EnumType.STRING)
    private ActivityType action;

    private String ipAddress;
    private String device;
    private String browser;

    private LocalDateTime timestamp;
}