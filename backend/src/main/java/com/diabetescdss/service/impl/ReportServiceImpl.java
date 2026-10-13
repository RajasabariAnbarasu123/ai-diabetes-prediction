package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.ReportUploadResponse;
import com.diabetescdss.exception.FileStorageException;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.ReportMapper;
import com.diabetescdss.model.ExtractedReportData;
import com.diabetescdss.model.MedicalReport;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.ExtractedReportDataRepository;
import com.diabetescdss.repository.MedicalReportRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.OcrService;
import com.diabetescdss.service.GeminiAiService;
import com.diabetescdss.service.ReportService;
import com.diabetescdss.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final MedicalReportRepository reportRepository;
    private final ExtractedReportDataRepository extractedDataRepository;
    private final OcrService ocrService;
    private final GeminiAiService geminiAiService;
    private final ReportMapper reportMapper;
    private final FileUploadUtil fileUploadUtil;

    @Override
    @Transactional
    public ReportUploadResponse uploadReport(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Save file to disk/cloud
        String filePath = fileUploadUtil.storeFile(file);

        MedicalReport report = MedicalReport.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath)
                .uploadDate(LocalDateTime.now())
                .build();
        report = reportRepository.save(report);

        // Extract text via PDFBox
        String extractedText = ocrService.extractText(file);

        ExtractedReportData extractedData = ExtractedReportData.builder()
                .report(report)
                .extractedText(extractedText)
                .build();

        // Use Gemini AI to extract structured lab metrics (HbA1c, FBS, cholesterol, HDL, LDL, triglycerides, etc.)
        extractedData = geminiAiService.parseExtractedReportData(extractedText, extractedData);
        extractedDataRepository.save(extractedData);

        // Generate AI summary
        String aiSummary = geminiAiService.generateReportSummary(extractedText);
        report.setAiSummary(aiSummary);
        reportRepository.save(report);

        // Build response
        ReportUploadResponse response = new ReportUploadResponse();
        response.setReport(reportMapper.toReportDto(report));
        response.setExtractedData(reportMapper.toExtractedDataDto(extractedData));
        response.setAiSummary(aiSummary);
        return response;
    }

    @Override
    public Page<ReportUploadResponse> getReports(Long userId, Pageable pageable) {
        return reportRepository.findByUserId(userId, pageable)
                .map(report -> {
                    ReportUploadResponse res = new ReportUploadResponse();
                    res.setReport(reportMapper.toReportDto(report));
                    if (report.getExtractedData() != null) {
                        res.setExtractedData(reportMapper.toExtractedDataDto(report.getExtractedData()));
                    }
                    res.setAiSummary(report.getAiSummary());
                    return res;
                });
    }

    @Override
    @Transactional
    public void deleteReport(Long userId, Long reportId) {
        MedicalReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if (!report.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Report not found");
        }
        fileUploadUtil.deleteFile(report.getFilePath());
        reportRepository.delete(report);
    }

    @Override
    public byte[] downloadReport(Long reportId) {
        MedicalReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return fileUploadUtil.readFileBytes(report.getFilePath());
    }
}