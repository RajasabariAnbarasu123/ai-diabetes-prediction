package com.diabetescdss.repository;

import com.diabetescdss.model.HealthScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthScoreRepository extends JpaRepository<HealthScore, Long> {
    Optional<HealthScore> findTopByUserIdOrderByCalculatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}