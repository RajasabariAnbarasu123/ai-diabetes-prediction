package com.diabetescdss.constant;

public final class AppConstants {

    private AppConstants() {}

    // Role names
    public static final String ROLE_PATIENT = "PATIENT";
    public static final String ROLE_ADMIN = "ADMIN";

    // Pagination defaults
    public static final String DEFAULT_PAGE = "0";
    public static final String DEFAULT_SIZE = "10";
    public static final String DEFAULT_SORT = "createdAt,desc";

    // JWT
    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

    // Email subjects
    public static final String EMAIL_VERIFICATION_SUBJECT = "Diabetes CDSS - Email Verification";
    public static final String PASSWORD_RESET_SUBJECT = "Diabetes CDSS - Password Reset";
    public static final String PREDICTION_REPORT_SUBJECT = "Your Diabetes Risk Assessment Report";
    public static final String WEEKLY_HEALTH_REPORT_SUBJECT = "Weekly Health Report";

    // File upload
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    public static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "pdf"};
}