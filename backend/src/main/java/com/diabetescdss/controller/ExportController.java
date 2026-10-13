package com.diabetescdss.controller;

import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/predictions/pdf")
    public ResponseEntity<Resource> exportPDF(@AuthenticationPrincipal CustomUserDetails user,
                                              Pageable pageable) {
        Resource resource = exportService.exportPredictionsPDF(user.getUser().getId(), pageable);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=predictions.pdf")
                .body(resource);
    }

    @GetMapping("/predictions/excel")
    public ResponseEntity<Resource> exportExcel(@AuthenticationPrincipal CustomUserDetails user,
                                                Pageable pageable) {
        Resource resource = exportService.exportPredictionsExcel(user.getUser().getId(), pageable);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=predictions.xlsx")
                .body(resource);
    }
}