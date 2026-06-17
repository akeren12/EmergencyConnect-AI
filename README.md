# 🚨 EmergencyConnect-AI

> **AI-Powered Emergency Assistance Backend built with Django REST Framework, Gemini AI, and Supabase**

[![Django CI](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml/badge.svg)](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django)
![DRF](https://img.shields.io/badge/Django_REST_Framework-API-red)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger)
![MkDocs](https://img.shields.io/badge/Documentation-MkDocs-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

# 📌 Overview

EmergencyConnect-AI is an intelligent emergency assistance backend that leverages **Generative AI** to provide quick emergency classification and first-aid guidance.

Given a user's emergency description, the system:

- 🚑 Identifies the emergency type
- ⚠️ Determines the priority level
- 📝 Generates a concise emergency summary
- 🩺 Provides immediate first-aid recommendations
- ☁️ Stores AI responses in Supabase for future analysis

The project demonstrates the integration of **Django REST Framework, Gemini AI, Supabase, Swagger/OpenAPI documentation, and MkDocs** to build a production-ready backend.

---

# ✨ Features

### 🤖 AI Emergency Analysis

- Natural language emergency understanding
- AI-powered emergency classification
- Priority detection (LOW / MEDIUM / HIGH / CRITICAL)
- Concise emergency summary generation

### 🩺 First Aid Assistance

- Immediate first-aid recommendations
- Safety-focused responses
- Structured JSON output

### 🌐 REST API

- Django REST Framework APIs
- JSON request/response format
- Modular backend architecture

### 📚 Documentation

- Interactive Swagger UI
- OpenAPI Schema
- MkDocs Documentation Site

### ☁️ Database

- Supabase Integration
- PostgreSQL Support
- Environment-based configuration

### 🔄 Reliability

- Retry mechanism with exponential backoff
- Graceful fallback responses
- Error handling for external APIs

---

# 🛠️ Tech Stack

| Technology | Purpose |
|-----------------------------|--------------------------------|
| Python | Backend Development |
| Django | Web Framework |
| Django REST Framework | REST APIs |
| Gemini AI | Emergency Analysis |
| Supabase | Database & Logging |
| SQLite / PostgreSQL | Data Storage |
| drf-spectacular | Swagger/OpenAPI Documentation |
| MkDocs | Project Documentation |

---

# 🏗️ Architecture

```

                User

↓

Django REST API

↓

Gemini AI Service

↓

Emergency Analysis

↓

Structured JSON Response

↓

Supabase Logging

```

---

# 📂 Project Structure

```

backend/

├── ai_assistant/

├── emergency/

├── users/

├── emergencyconnect/

├── docs/

│ ├── index.md

│ ├── installation.md

│ ├── api.md

│ ├── ai_module.md

│ └── deployment.md

├── manage.py

├── requirements.txt

├── mkdocs.yml

└── README.md

```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/akeren12/EmergencyConnect-AI.git

cd EmergencyConnect-AI/backend
```

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ⚙️ Environment Variables

Create a `.env` file.

```
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=your_database_url

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# ▶️ Running the Project

Apply migrations

```bash
python manage.py migrate
```

Start the development server

```bash
python manage.py runserver
```

Server URL

```
http://127.0.0.1:8000/
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|----------------|--------------------------------|--------------------------------|
| POST | `/api/ai/analyze/` | Analyze emergency description |
| GET | `/api/schema/` | OpenAPI Schema |
| GET | `/api/schema/swagger-ui/` | Interactive Swagger UI |
| GET | `/api/schema/redoc/` | ReDoc Documentation |

---

# 🤖 Sample Request

```json
{
    "description": "A person is unconscious and not breathing."
}
```

---

# ✅ Sample Response

```json
{
    "emergency_type": "Cardiac Arrest",
    "priority": "CRITICAL",
    "summary": "The person appears to be in cardiac arrest.",
    "first_aid": [
        "Call emergency services immediately.",
        "Begin CPR if trained.",
        "Use an AED if available."
    ],
    "disclaimer": "This AI guidance does not replace professional medical care."
}
```

---

# 📚 API Documentation

## Swagger UI

```
http://127.0.0.1:8000/api/schema/swagger-ui/
```

Interactive API documentation for testing endpoints.

---

## OpenAPI Schema

```
http://127.0.0.1:8000/api/schema/
```

Machine-readable API specification.

---

## MkDocs

```
mkdocs serve
```

Local project documentation site.

---

# 🚀 Current Status

| Module | Status |
|------------------------------|------------|
| Django Backend | ✅ Completed |
| REST APIs | ✅ Completed |
| Gemini AI Integration | ✅ Completed |
| Swagger Documentation | ✅ Completed |
| MkDocs Documentation | ✅ Completed |
| Supabase Integration | ✅ Completed |
| Retry & Fallback Logic | ✅ Completed |
| Deployment | 🔄 In Progress |

---

# 🔮 Future Enhancements

- 📱 One-Tap SOS
- 🎤 Voice Emergency Detection
- 🏥 Nearby Hospital Locator
- 🩸 Blood Bank Recommendations
- 💊 Pharmacy Recommendations
- 🌍 Multilingual Emergency Support
- 📍 Live Location Sharing
- 🚨 AI-generated SOS Messages

---

# 📈 Project Highlights

- ✅ AI-powered emergency classification
- ✅ Django REST Framework backend
- ✅ Gemini AI integration
- ✅ Supabase database integration
- ✅ Interactive Swagger documentation
- ✅ MkDocs documentation site
- ✅ Structured JSON responses
- ✅ Production-ready architecture
- ✅ Retry & fallback mechanism

---

# 👩‍💻 Author

**Aksa Elsa**

**B.Tech Computer Science & Engineering (Data Science)**

Passionate about **Artificial Intelligence, Backend Development, Django REST Framework, and Generative AI Applications.**

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
