package com.diabetescdss.service;

import com.diabetescdss.dto.response.ReportUploadResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ReportService {
    ReportUploadResponse uploadReport(Long userId, MultipartFile file);
    Page<ReportUploadResponse> getReports(Long userId, Pageable pageable);
    void deleteReport(Long userId, Long reportId);
    byte[] downloadReport(Long reportId);
}