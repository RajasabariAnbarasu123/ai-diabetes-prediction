# Architecture Overview

## System Design

The Diabetes CDSS follows a **classic three‑tier** architecture with a **React Single Page Application (SPA)** as the presentation layer, a **Spring Boot REST API** as the business logic layer, and a **PostgreSQL** database for persistence.

## High‑Level Diagram
[Browser] <--> [React SPA :3000] <--> [Spring Boot API :8080] <--> [PostgreSQL]
| |
[Gemini AI API] [Google Vision OCR]
|
[SMTP Server]

text

## Frontend (React 19 + Vite)

- **State Management**: Redux Toolkit with Redux Persist (localStorage).
- **Routing**: React Router v6 with protected routes (PrivateRoute, AdminRoute).
- **UI Framework**: Material UI + Tailwind CSS for rapid prototyping and custom styling.
- **Form Handling**: React Hook Form + Zod for validation.
- **Charts**: Recharts (Line, Bar, Pie, Area).
- **Animations**: Framer Motion.
- **File Upload**: React Dropzone.
- **HTTP Client**: Axios with interceptors for JWT refresh.

## Backend (Spring Boot 3.2 + Java 21)

- **Security**: Spring Security + JWT (access & refresh tokens). Role‑based authorization (PATIENT, ADMIN).
- **Persistence**: Spring Data JPA + Hibernate. Flyway for database migrations.
- **Validation**: Jakarta Bean Validation.
- **AI Integration**: Google Gemini API via WebClient (reactive). All prompts are built in `util/PromptBuilder`.
- **OCR**: Google Cloud Vision client library for extracting text from reports.
- **Email**: Spring Mail (SMTP) with Thymeleaf templates.
- **File Storage**: Local disk (configurable directory), with plans for cloud storage.
- **Exception Handling**: Global `@RestControllerAdvice` with custom exceptions.

## Database Schema

The PostgreSQL database contains 16 tables covering:
- Users & roles
- JWT tokens (refresh, email verification, password reset)
- Predictions & AI results
- Medical reports & OCR extractions
- Comparison history, health scores, analytics cache
- Medications & reminders
- Notifications
- AI chat history
- Activity & audit logs

All foreign keys are properly indexed.

## Deployment Considerations

- The backend can be deployed as a Docker container behind a reverse proxy (Nginx).
- The frontend can be served as static files from a CDN or Nginx.
- Environment variables must be set for all secrets and external service keys.