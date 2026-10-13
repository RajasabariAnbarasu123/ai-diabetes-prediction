package com.diabetescdss.repository;

import com.diabetescdss.model.ExtractedReportData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExtractedReportDataRepository extends JpaRepository<ExtractedReportData, Long> {
    Optional<ExtractedReportData> findByReportId(Long reportId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ExtractedReportData erd WHERE erd.report.user.id = :userId")
    void deleteByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}