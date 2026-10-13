const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROLES = {
  PATIENT: 'PATIENT',
  ADMIN: 'ADMIN',
};

export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const DIABETES_STAGES = {
  NORMAL: 'Normal',
  PREDIABETES: 'Prediabetes',
  TYPE2_CONTROLLED: 'Type 2 – Controlled',
  TYPE2_UNCONTROLLED: 'Type 2 – Uncontrolled',
  TYPE1: 'Type 1',
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
};

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
};

export default API_BASE_URL;