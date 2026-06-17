
#🚨 EmergencyConnect-AI

AI-powered Emergency Assistance Backend built with Django REST Framework, Gemini AI, and Supabase.

EmergencyConnect-AI analyzes emergency descriptions, classifies emergency types, determines priority levels, and provides immediate first-aid recommendations using Generative AI.


## Badges

[![Django CI](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml/badge.svg)](https://github.com/akeren12/EmergencyConnect-AI/actions/workflows/django.yml)

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)

![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django)

![DRF](https://img.shields.io/badge/Django_REST_Framework-API-red)

![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4)

![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)

![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D)

![MkDocs](https://img.shields.io/badge/Documentation-MkDocs-blue)
## About
EmergencyConnect-AI is an intelligent emergency assistance backend that leverages Generative AI to provide quick emergency classification and first-aid guidance.

Features:

• Emergency Type Classification

• Priority Detection

• AI-generated Emergency Summary

• First Aid Recommendations

• Supabase Logging

• Swagger Documentation

• MkDocs Documentation
## Tech Stack

**Backend**

- Python
- Django
- Django REST Framework

**AI**

- Gemini AI

**Database**

- Supabase
- PostgreSQL / SQLite

**Documentation**

- drf-spectacular (Swagger)
- MkDocs


## API Reference

### POST /api/ai/analyze/

Analyzes emergency descriptions and returns:

- emergency type
- priority
- summary
- first aid recommendations

Example Request

{
    "description":"A person is unconscious and not breathing."
}

Example Response

{
    "emergency_type":"Cardiac Arrest",
    "priority":"CRITICAL",
    "summary":"Person appears unconscious.",
    "first_aid":[
        "Call emergency services",
        "Begin CPR",
        "Use AED if available"
    ]
}


## Installation

git clone https://github.com/akeren12/EmergencyConnect-AI.git

cd EmergencyConnect-AI/backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
    
## Documentation

Swagger UI

http://127.0.0.1:8000/api/schema/swagger-ui/

OpenAPI Schema

http://127.0.0.1:8000/api/schema/

MkDocs

mkdocs serve


## Features

✅ AI Emergency Analysis

✅ Emergency Classification

✅ Priority Detection

✅ First Aid Recommendations

✅ REST APIs

✅ Swagger Documentation

✅ MkDocs Documentation

✅ Supabase Integration

✅ Retry & Fallback Logic


## Future Scope

- One-Tap SOS

- Voice Emergency Detection

- Nearby Hospital Locator

- Blood Bank Recommendations

- Pharmacy Recommendations

- AI-generated SOS Messages
## Authors

Aksa Elsa

B.Tech Computer Science & Engineering (Data Science)

Django | REST API | Artificial Intelligence | Generative AI

