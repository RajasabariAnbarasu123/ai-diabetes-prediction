-- Add new columns for medication reminder times and notification preferences
ALTER TABLE medications ADD COLUMN IF NOT EXISTS morning_time VARCHAR(20) DEFAULT '08:00';
ALTER TABLE medications ADD COLUMN IF NOT EXISTS afternoon_time VARCHAR(20) DEFAULT '13:00';
ALTER TABLE medications ADD COLUMN IF NOT EXISTS night_time VARCHAR(20) DEFAULT '20:00';
ALTER TABLE medications ADD COLUMN IF NOT EXISTS app_notification BOOLEAN DEFAULT TRUE;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS email_notification BOOLEAN DEFAULT TRUE;
