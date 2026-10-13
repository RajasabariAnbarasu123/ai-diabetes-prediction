package com.diabetescdss.repository;

import com.diabetescdss.model.AnalyticsCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalyticsCacheRepository extends JpaRepository<AnalyticsCache, Long> {
    Optional<AnalyticsCache> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}