package com.diabetescdss.service;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;

public interface ExportService {
    Resource exportPredictionsPDF(Long userId, Pageable pageable);
    Resource exportPredictionsExcel(Long userId, Pageable pageable);
}