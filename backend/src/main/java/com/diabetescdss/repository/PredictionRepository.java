package com.diabetescdss.repository;

import com.diabetescdss.model.Prediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    Page<Prediction> findByUserId(Long userId, Pageable pageable);
    Page<Prediction> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    List<Prediction> findTop2ByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);

    @Query("SELECT AVG(p.hba1c) FROM Prediction p WHERE p.user.id = :userId")
    Double avgHba1cByUserId(@Param("userId") Long userId);

    // Admin: all predictions with search and risk level filter
    Page<Prediction> findAll(Pageable pageable);
    Page<Prediction> findByUserEmailContainingIgnoreCase(String email, Pageable pageable);

    @Query("SELECT p FROM Prediction p WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(p.user.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:risk IS NULL OR p.diabetesRisk = :risk)")
    Page<Prediction> findBySearchAndRisk(@Param("search") String search, @Param("risk") com.diabetescdss.enums.RiskLevel risk, Pageable pageable);

    void deleteByUserId(Long userId);

    long countByDiabetesRisk(com.diabetescdss.enums.RiskLevel diabetesRisk);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}