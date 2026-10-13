# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

All endpoints except `/api/auth/**` require `Authorization: Bearer <access_token>`.

### **POST** `/api/auth/register`
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: 201 Created (check email for verification)

POST /api/auth/login
Request:

json
{
  "email": "john@example.com",
  "password": "password123"
}
Response:

json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  },
  "accessToken": "eyJ...",
  "refreshToken": "dGhpcyBpcyBh..."
}
POST /api/auth/refresh
json
{
  "refreshToken": "dGhpcyBpcyBh..."
}
POST /api/auth/forgot-password
json
{ "email": "john@example.com" }
POST /api/auth/reset-password
json
{
  "token": "reset-token-from-email",
  "newPassword": "newPass123"
}
GET /api/auth/verify-email?token=...
Predictions
POST /api/predictions
Creates a new diabetes risk prediction.
Requires full patient data (see PredictionRequest schema).

GET /api/predictions?page=0&size=10
Returns paginated prediction history for the authenticated user.

GET /api/predictions/{id}
DELETE /api/predictions/{id}
POST /api/predictions/compare?id1=1&id2=2
Returns comparison between two predictions.

Medical Reports
POST /api/reports (multipart/form-data)
Upload a file (PDF/JPEG/PNG). Returns extracted text + AI summary.

GET /api/reports?page=0&size=10
GET /api/reports/{id}/download
DELETE /api/reports/{id}
AI Endpoints
POST /api/ai/chat
json
{ "message": "Can I eat mango?" }
GET /api/ai/diet (optional query params: dietType, region)
GET /api/ai/exercise
GET /api/ai/tip
Profile
GET /api/profile
PUT /api/profile
POST /api/profile/change-password
Medications
GET /api/medications
POST /api/medications
PUT /api/medications/{id}
DELETE /api/medications/{id}
Notifications
GET /api/notifications
PATCH /api/notifications/{id}/read
Analytics
GET /api/analytics
Admin Endpoints (require ADMIN role)
GET /api/admin/stats
GET /api/admin/users?search=...
PATCH /api/admin/users/{id}/disable
PATCH /api/admin/users/{id}/enable
DELETE /api/admin/users/{id}
GET /api/admin/predictions
GET /api/admin/reports
GET /api/admin/activity-logs
GET /api/admin/audit-logs
Export
GET /api/export/predictions/pdf
GET /api/export/predictions/excel
All API responses follow a consistent JSON structure, with errors returning:

json
{
  "timestamp": "2025-03-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": "..."
}