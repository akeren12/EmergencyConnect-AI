# System Architecture

```mermaid
flowchart TD

A[User]

B[Django REST API]

C[Gemini AI]

D[Emergency Analysis]

E[JSON Response]

F[Supabase Database]

A --> B

B --> C

C --> D

D --> E

E --> F
```