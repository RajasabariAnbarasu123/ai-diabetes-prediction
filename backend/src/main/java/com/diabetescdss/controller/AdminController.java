package com.diabetescdss.controller;

import com.diabetescdss.dto.response.ActivityLogResponse;
import com.diabetescdss.dto.response.AdminStatsResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.dto.response.ReportUploadResponse;
import com.diabetescdss.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> stats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<ProfileResponse>> users(@RequestParam(required = false) String search,
                                                       Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsers(pageable, search));
    }

    @PatchMapping("/users/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) {
        adminService.disableUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable Long id) {
        adminService.enableUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/predictions")
    public ResponseEntity<Page<PredictionResponse>> predictions(@RequestParam(required = false) String search,
                                                                @RequestParam(required = false) String risk,
                                                                Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllPredictions(pageable, search, risk));
    }

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportUploadResponse>> reports(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllReports(pageable));
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<Page<ActivityLogResponse>> activityLogs(Pageable pageable) {
        return ResponseEntity.ok(adminService.getActivityLogs(pageable));
    }
}