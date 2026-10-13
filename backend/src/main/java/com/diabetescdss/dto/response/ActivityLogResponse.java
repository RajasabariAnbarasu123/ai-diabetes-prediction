package com.diabetescdss.dto.response;

import com.diabetescdss.enums.ActivityType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private ActivityType action;
    private String ipAddress;
    private String device;
    private String browser;
    private LocalDateTime timestamp;
    private String status;
}
