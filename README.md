# 🚨 EmergencyConnect-AI

> **AI-Powered Emergency Assistance Backend built with Django REST Framework, Gemini AI & Supabase**

[![Django CI](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml/badge.svg)](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django)
![DRF](https://img.shields.io/badge/DRF-REST_API-red)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D)
![MkDocs](https://img.shields.io/badge/Documentation-MkDocs-blue)

--- 

## 📌 Overview

EmergencyConnect-AI is an intelligent emergency assistance backend that leverages **Generative AI** to provide quick emergency classification and first-aid guidance.

Given a user's emergency description, the system:

- 🚑 Classifies the emergency type
- ⚠️ Determines the priority level
- 📝 Generates a concise emergency summary
- 🩺 Provides immediate first-aid recommendations
- ☁️ Stores AI responses for future analysis

---

## ✨ Features

| Feature | Description |
|----------------------------|---------------------------------------------|
| 🤖 AI Emergency Analysis | Understands natural language emergencies |
| 🚑 Emergency Classification | Identifies emergency category |
| ⚠️ Priority Detection | LOW / MEDIUM / HIGH / CRITICAL |
| 🩺 First Aid Assistance | Immediate safety recommendations |
| 📚 Swagger Documentation | Interactive API testing |
| 📖 MkDocs Documentation | Complete project documentation |
| ☁️ Supabase Integration | Cloud database logging |
| 🔄 Retry & Fallback Logic | Handles AI/API failures gracefully |

---

## 🛠 Tech Stack

| Category | Technologies |
|----------------|--------------------------------|
| **Backend** | Python, Django, Django REST Framework |
| **AI** | Gemini AI |
| **Database** | Supabase, PostgreSQL, SQLite |
| **Documentation** | Swagger (drf-spectacular), MkDocs |

---

## 🏗 Architecture

```text
             User
                │
                ▼
       Django REST API
                │
                ▼
         Gemini AI Service
                │
                ▼
      Emergency Classification
                │
                ▼
        Structured JSON Output
                │
                ▼
         Supabase Logging
```

---

## 📂 Project Structure

```text
backend/
│
├── ai_assistant/
├── emergency/
├── users/
├── emergencyconnect/
├── docs/
│   ├── index.md
│   ├── installation.md
│   ├── api.md
│   ├── ai_module.md
│   └── deployment.md
│
├── manage.py
├── requirements.txt
├── mkdocs.yml
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/akeren12/EmergencyConnect-AI.git

cd EmergencyConnect-AI/backend
```

Create virtual environment

```bash
python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Start server

```bash
python manage.py runserver
```

---
## 📸 Project Screenshots

| Swagger UI | MkDocs Documentation |
|------------|---------------------|
| ![Swagger UI](docs/images/swagger-ui.png) | ![MkDocs Documentation](docs/images/mkdocs-home.png) |
docs/images/mkdocs-home.png
```
## 📡 API Endpoints

| Method | Endpoint | Description |
|------------|---------------------------|----------------------------|
| POST | `/api/ai/analyze/` | Analyze emergency description |
| GET | `/api/schema/` | OpenAPI Schema |
| GET | `/api/schema/swagger-ui/` | Swagger Documentation |

---

## 🤖 Sample Request

```json
{
    "description": "A person is unconscious and not breathing."
}
```

---

## ✅ Sample Response

```json
{
    "emergency_type": "Cardiac Arrest",
    "priority": "CRITICAL",
    "summary": "The person appears to be in cardiac arrest.",
    "first_aid": [
        "Call emergency services immediately.",
        "Begin CPR if trained.",
        "Use an AED if available."
    ]
}
```

---

## 📚 Documentation

| Documentation | Link |
|----------------------|----------------------------------|
| Swagger UI | `/api/schema/swagger-ui/` |
| OpenAPI Schema | `/api/schema/` |
| MkDocs | `mkdocs serve` |

---

## 🚀 Current Status

| Module | Status |
|----------------------------|------------|
| Django Backend | ✅ Completed |
| REST APIs | ✅ Completed |
| Gemini AI Integration | ✅ Completed |
| Swagger Documentation | ✅ Completed |
| MkDocs Documentation | ✅ Completed |
| Supabase Integration | ✅ Completed |
| Retry & Fallback Logic | ✅ Completed |
| Deployment | 🔄 In Progress |

---

## 🔮 Future Enhancements

- 📱 One-Tap SOS
- 🎤 Voice Emergency Detection
- 🏥 Nearby Hospital Locator
- 🩸 Blood Bank Recommendations
- 💊 Pharmacy Recommendations
- 🌍 Multilingual Support
- 📍 Live Location Sharing
- 🚨 AI-generated SOS Messages

---
## 🌐 Live Demo

Deployment in progress.

```
Live URL:
https://your-live-url.com
```

*(Replace after deployment.)*

## 👩‍💻 Author

**Aksa Elsa**

B.Tech Computer Science & Engineering (Data Science)

**AI • Django • REST APIs • Generative AI**

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

Built with ❤️ using Django REST Framework & Gemini AI

</div>
