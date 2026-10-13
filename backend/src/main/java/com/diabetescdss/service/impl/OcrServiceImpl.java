package com.diabetescdss.service.impl;

import com.diabetescdss.service.OcrService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Slf4j
@Service
public class OcrServiceImpl implements OcrService {

    @Override
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded report file is empty.");
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";

        if (!filename.endsWith(".pdf") && !contentType.contains("pdf")) {
            throw new IllegalArgumentException("Only PDF documents are supported. Please upload a valid .pdf medical report.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                log.warn("No text extracted from PDF file: {}", file.getOriginalFilename());
                return "No readable text detected in the uploaded PDF report. Please ensure it contains text data.";
            }

            String trimmedText = text.trim();
            log.info("Successfully extracted {} characters from PDF report '{}' using Apache PDFBox",
                    trimmedText.length(), file.getOriginalFilename());
            return trimmedText;

        } catch (Exception e) {
            log.error("Failed to extract text from PDF report using Apache PDFBox: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to read PDF medical report: " + e.getMessage(), e);
        }
    }
}