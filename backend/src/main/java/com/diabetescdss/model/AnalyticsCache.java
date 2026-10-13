package com.diabetescdss.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String cacheData;

    private LocalDateTime updatedAt;
}