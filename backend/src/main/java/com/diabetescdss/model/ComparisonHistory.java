package com.diabetescdss.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comparison_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComparisonHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction1_id", nullable = false)
    private Prediction prediction1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction2_id", nullable = false)
    private Prediction prediction2;

    @Column(length = 2000)
    private String differences;

    @Column(length = 2000)
    private String explanation;

    private LocalDateTime comparedAt;
}