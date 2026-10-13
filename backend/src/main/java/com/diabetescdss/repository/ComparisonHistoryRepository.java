package com.diabetescdss.repository;

import com.diabetescdss.model.ComparisonHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComparisonHistoryRepository extends JpaRepository<ComparisonHistory, Long> {
    Page<ComparisonHistory> findByUserId(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}