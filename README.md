# Diabetes CDSS – AI‑Based Clinical Decision Support System

**Final Year Engineering Major Project**

A production‑quality **Diabetes Clinical Decision Support System** built with **React 19 + Vite** (frontend) and **Spring Boot 3 + Java 21** (backend).  
The system helps patients monitor diabetes risk, assists healthcare providers with AI‑powered decision support, and maintains complete patient history with advanced analytics.

---

## 🚀 Features

### 👤 Patient Portal
- **Dashboard** – Welcome card, current risk, last HbA1c, health score, trends.
- **Prediction** – Manual entry of medical data → Gemini AI risk assessment, diet, exercise, lifestyle tips.
- **Report Upload** – PDF/Image upload → Google Vision OCR → auto‑fill form → AI summary.
- **History** – Search, filter, sort, delete, export (PDF/Excel).
- **Comparison** – Side‑by‑side prediction comparison with AI explanation.
- **Analytics** – Charts: HbA1c, BMI, Blood Sugar trends, risk distribution.
- **AI Health Coach** – Chat with Gemini, conversation memory, suggested questions.
- **Diet & Exercise Plans** – Personalized daily/weekly meal & exercise recommendations.
- **Medication Reminders** – Add, update, delete medications with timing.
- **Profile & Notifications** – Manage account, receive real‑time alerts.

### 🔐 Authentication & Security
- JWT + Refresh Token auth, role‑based access (Patient / Admin).
- Email verification, password reset, BCrypt encryption.
- CSRF, XSS protection, rate limiting, secure headers.

### 🛡️ Admin Panel
- Dashboard with system statistics (users, predictions, reports, storage).
- User management (search, disable, enable, delete).
- Prediction & report management.
- Activity & audit logs.

---

## 🧱 Technology Stack

| Layer       | Technology                                                       |
|-------------|------------------------------------------------------------------|
| **Frontend**| React 19, Vite, Tailwind CSS, Material UI, Redux Toolkit, Recharts, Framer Motion, React Hook Form + Zod |
| **Backend** | Java 21, Spring Boot 3.2, Spring Security, JPA/Hibernate, JWT, MapStruct, Lombok |
| **Database**| PostgreSQL (Supabase)                                            |
| **AI**      | Google Gemini API (risk analysis, diet, exercise, chat, tips)    |
| **OCR**     | Google Cloud Vision (text extraction from medical reports)       |
| **Email**   | SMTP (SendGrid / Gmail)                                          |
| **DevOps**  | Docker, Docker Compose (optional)                                |

---

## 📁 Project Structure
diabetes-cdss/
├── frontend/ # React 19 + Vite
│ ├── src/ # Components, pages, store, services, hooks, ...
│ ├── public/
│ ├── package.json
│ └── ...
├── backend/ # Spring Boot 3 + Java 21
│ ├── src/main/java/com/diabetescdss/
│ │ ├── config/
│ │ ├── model/
│ │ ├── dto/
│ │ ├── repository/
│ │ ├── service/
│ │ ├── controller/
│ │ ├── security/
│ │ └── util/
│ └── src/main/resources/
│ ├── application.yml
│ ├── db/migration/
│ └── templates/
├── docs/ # Architecture, API docs, prompt engineering
├── docker-compose.yml
└── README.md

text

---

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 18
- Java 21 (JDK)
- Maven 3.8+
- PostgreSQL (or Supabase project)
- Google Gemini API key
- Google Cloud Vision service account (optional, for OCR)

### Backend Setup

```bash
cd backend

# Configure environment variables
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, Gemini key, etc.

# Run with Maven
./mvnw spring-boot:run
The API will be available at http://localhost:8080/api.
Swagger UI: http://localhost:8080/swagger-ui/index.html

Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
The app will open at http://localhost:3000.

📄 Environment Variables
Variable	Description
DB_URL	PostgreSQL connection string
DB_USERNAME	Database user
DB_PASSWORD	Database password
JWT_SECRET	Secret key for JWT
JWT_EXPIRATION_MS	Access token validity (ms)
JWT_REFRESH_EXPIRATION_MS	Refresh token validity (ms)
MAIL_HOST	SMTP host
MAIL_PORT	SMTP port
MAIL_USERNAME	SMTP username
MAIL_PASSWORD	SMTP password
GEMINI_API_KEY	Google Gemini API key
GOOGLE_APPLICATION_CREDENTIALS	Path to Cloud Vision service account JSON
FILE_UPLOAD_DIR	Local directory for uploaded files
🧪 Testing
bash
# Backend unit & integration tests
cd backend
./mvnw test

# Frontend tests (add your own React Testing Library tests)
cd frontend
npm test

🐳 Docker (Optional)
bash
docker compose up -d
The docker-compose.yml starts a PostgreSQL instance and a MailHog for email testing.
Adjust environment variables accordingly.

📚 Documentation
Architecture

API Documentation

Prompt Engineering

👥 Team
Your team names and contributions

📝 License
This project is for academic purposes.

Built with ❤️ by [Your Name] – Final Year Engineering Project
