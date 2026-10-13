-- Users and Roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    height DOUBLE PRECISION,
    weight DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    medical_history TEXT,
    family_history TEXT,
    emergency_contact VARCHAR(100),
    enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255),
    age INT,
    gender VARCHAR(10),
    height DOUBLE PRECISION,
    weight DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    fasting_blood_sugar DOUBLE PRECISION,
    random_blood_sugar DOUBLE PRECISION,
    hba1c DOUBLE PRECISION,
    blood_pressure VARCHAR(20),
    cholesterol DOUBLE PRECISION,
    hdl DOUBLE PRECISION,
    ldl DOUBLE PRECISION,
    triglycerides DOUBLE PRECISION,
    family_history BOOLEAN,
    smoking BOOLEAN,
    alcohol BOOLEAN,
    physical_activity VARCHAR(50),
    daily_water_intake DOUBLE PRECISION,
    sleep_hours DOUBLE PRECISION,
    diet_type VARCHAR(20),
    stress_level VARCHAR(20),
    existing_diseases TEXT,
    current_medications TEXT,
    frequent_urination BOOLEAN,
    increased_thirst BOOLEAN,
    weight_loss BOOLEAN,
    blurred_vision BOOLEAN,
    fatigue BOOLEAN,
    slow_wound_healing BOOLEAN,
    tingling_sensation BOOLEAN,
    increased_hunger BOOLEAN,
    diabetes_risk VARCHAR(20),
    diabetes_stage VARCHAR(30),
    confidence_score DOUBLE PRECISION,
    explanation TEXT,
    risk_factors TEXT,
    clinical_summary TEXT,
    personalized_diet TEXT,
    exercise_plan TEXT,
    lifestyle_changes TEXT,
    foods_to_eat TEXT,
    foods_to_avoid TEXT,
    medication_reminders TEXT,
    warning_signs TEXT,
    when_to_consult_doctor TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Medical Reports
CREATE TABLE IF NOT EXISTS medical_reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_path VARCHAR(500),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_summary TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS extracted_report_data (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE,
    extracted_text TEXT,
    hba1c DOUBLE PRECISION,
    blood_sugar DOUBLE PRECISION,
    blood_pressure_systolic DOUBLE PRECISION,
    blood_pressure_diastolic DOUBLE PRECISION,
    cholesterol DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    weight DOUBLE PRECISION,
    age INT,
    medications TEXT,
    lab_values TEXT,
    FOREIGN KEY (report_id) REFERENCES medical_reports(id) ON DELETE CASCADE
);

-- Comparison History
CREATE TABLE IF NOT EXISTS comparison_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    prediction1_id BIGINT NOT NULL,
    prediction2_id BIGINT NOT NULL,
    differences TEXT,
    explanation TEXT,
    compared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prediction1_id) REFERENCES predictions(id) ON DELETE CASCADE,
    FOREIGN KEY (prediction2_id) REFERENCES predictions(id) ON DELETE CASCADE
);

-- Health Score
CREATE TABLE IF NOT EXISTS health_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    overall_score DOUBLE PRECISION,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics Cache
CREATE TABLE IF NOT EXISTS analytics_cache (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    cache_data TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Medications & Reminders
CREATE TABLE IF NOT EXISTS medications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    medicine_name VARCHAR(255),
    dose VARCHAR(100),
    morning BOOLEAN DEFAULT FALSE,
    afternoon BOOLEAN DEFAULT FALSE,
    night BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medication_reminders (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT NOT NULL,
    reminder_time TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI Chat History
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity & Audit Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(50),
    ip_address VARCHAR(45),
    device VARCHAR(255),
    browser VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT,
    action VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);