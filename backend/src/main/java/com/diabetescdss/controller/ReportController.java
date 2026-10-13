package com.diabetescdss.controller;

import com.diabetescdss.dto.response.ReportUploadResponse;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportUploadResponse> upload(@AuthenticationPrincipal CustomUserDetails user,
                                                       @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.uploadReport(user.getUser().getId(), file));
    }

    @GetMapping
    public ResponseEntity<Page<ReportUploadResponse>> list(@AuthenticationPrincipal CustomUserDetails user,
                                                           Pageable pageable) {
        return ResponseEntity.ok(reportService.getReports(user.getUser().getId(), pageable));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        byte[] content = reportService.downloadReport(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=report")
                .body(content);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails user,
                                       @PathVariable Long id) {
        reportService.deleteReport(user.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}