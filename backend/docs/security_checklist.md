# Security Checklist

## OWASP Top 10 Review

### Broken Access Control

* JWT Authentication implemented for protected endpoints.

### Cryptographic Failures

* Secrets stored in .env file.
* .env excluded from Git using .gitignore.

### Injection

* Django ORM used instead of raw SQL queries.

### Insecure Design

* Input validation implemented using DRF serializers.

### Security Misconfiguration

* Environment variables used for configuration.
* CORS configured explicitly.

### Vulnerable Components

* Dependencies managed through requirements.txt.

### Identification and Authentication Failures

* JWT-based authentication enabled.

### Software and Data Integrity Failures

* GitHub workflow and version control used.

### Security Logging and Monitoring

* API errors handled and logged.

### SSRF

* No user-supplied external URLs are fetched.

## Additional Security Measures

* Rate limiting implemented using django-ratelimit.
* Input validation added for AI endpoints.
* Environment variables secured.
* API fallback responses implemented.
