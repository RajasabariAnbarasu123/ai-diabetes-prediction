package com.diabetescdss.repository;

import com.diabetescdss.model.MedicalReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    Page<MedicalReport> findByUserId(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}