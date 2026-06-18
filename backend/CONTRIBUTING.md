# Contributing to EmergencyConnect-AI

Thank you for your interest in contributing to EmergencyConnect-AI!

## Getting Started

### Clone the repository

```bash
git clone https://github.com/akeren12/EmergencyConnect-AI.git
cd EmergencyConnect-AI/backend
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the environment

Windows

```bash
venv\Scripts\activate
```

Linux/Mac

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run the project

```bash
python manage.py migrate
python manage.py runserver
```

---

## Branch Naming

```
feature/new-feature
fix/bug-fix
docs/documentation-update
```

---

## Commit Message Format

```
feat: add emergency endpoint

fix: improve Gemini retry logic

docs: update README
```

---

## Pull Requests

- Keep PRs focused
- Test changes before submitting
- Write clear commit messages
- Update documentation if required

Thank you for contributing!