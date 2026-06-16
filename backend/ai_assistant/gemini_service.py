"""
ai_service.py
EmergencyConnect AI Service

Features:
- Gemini API integration
- API error handling
- Token/input limit handling
- Rate limit retry with exponential backoff
- Fallback emergency response
- Save AI outputs to Supabase
- Returns structured JSON responses

Required packages:
pip install google-genai supabase python-dotenv
"""

import os
import json
import time
from datetime import datetime
from dotenv import load_dotenv

from google import genai
from supabase import create_client, Client

load_dotenv()

# ======================================================
# Configuration
# ======================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

MODEL_NAME = "gemini-2.5-flash"

MAX_INPUT_LENGTH = 4000
MAX_RETRIES = 3

# ======================================================
# Gemini Client
# ======================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)

# ======================================================
# Supabase Client
# ======================================================

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# ======================================================
# System Prompt
# ======================================================

SYSTEM_PROMPT = """
You are EmergencyConnect AI.

You are an emergency first-aid assistant.

Always respond ONLY in valid JSON.

Format:

{
  "emergency_type": "",
  "priority": "",
  "summary": "",
  "first_aid": [
    "",
    ""
  ],
  "disclaimer": ""
}

Priority must be one of:

LOW
MEDIUM
HIGH
CRITICAL

Keep responses short and medically safe.

Always include the disclaimer:

"This AI guidance does not replace professional medical care. Contact emergency services immediately if the situation is serious."
"""

# ======================================================
# Fallback Response
# ======================================================

def fallback_response():

    return {

        "emergency_type": "Unknown Emergency",

        "priority": "HIGH",

        "summary": "AI service is currently unavailable.",

        "first_aid": [

            "Stay calm.",

            "Ensure the area is safe.",

            "Call local emergency services immediately.",

            "Follow instructions from trained professionals."

        ],

        "disclaimer": "This AI guidance does not replace professional medical care. Contact emergency services immediately if the situation is serious."

    }

# ======================================================
# Save Output to Supabase
# ======================================================

def save_to_supabase(user_input, ai_output):

    print(">>> save_to_supabase() called")

    try:

        data = {
            "user_input": user_input,
            "ai_output": json.dumps(ai_output),
            "created_at": datetime.utcnow().isoformat()
        }

        print(">>> Data:", data)

        response = supabase.table("ai_logs").insert(data).execute()

        print(">>> INSERT SUCCESS")
        print(response)

    except Exception as e:

        print(">>> INSERT FAILED")
        print(type(e))
        print(e)

# ======================================================
# Parse Gemini JSON
# ======================================================

def parse_json(text):

    try:

        text = text.replace("```json", "")

        text = text.replace("```", "")

        text = text.strip()

        return json.loads(text)

    except Exception:

        return fallback_response()

# ======================================================
# Generate AI Response
# ======================================================

def generate_ai_response(user_message):
    print("generate_ai_response() called")
    try:

        if not user_message:

            return fallback_response()

        # --------------------------
        # Token/Input protection
        # --------------------------

        if len(user_message) > MAX_INPUT_LENGTH:

            user_message = user_message[:MAX_INPUT_LENGTH]

        prompt = f"""

{SYSTEM_PROMPT}

User Emergency:

{user_message}

"""

        # --------------------------
        # Retry Logic
        # --------------------------

        for attempt in range(MAX_RETRIES):

            try:

                response = client.models.generate_content(

                    model=MODEL_NAME,

                    contents=prompt

                )

                text = response.text

                parsed = parse_json(text)

                save_to_supabase(

                    user_input=user_message,

                    ai_output=parsed

                )

                return parsed

            except Exception as e:

                print("Gemini Retry:", str(e))

                if attempt < MAX_RETRIES - 1:

                    wait = 2 ** attempt

                    time.sleep(wait)

                else:

                    raise e

    except Exception as e:

        print("Gemini Error:", str(e))

        fallback = fallback_response()

        save_to_supabase(

            user_input=user_message,

            ai_output=fallback

        )

        return fallback

# ======================================================
# Health Check
# ======================================================

def health_check():

    try:

        response = client.models.generate_content(

            model=MODEL_NAME,

            contents="Reply with OK"

        )

        return {

            "status": "online",

            "message": response.text

        }

    except Exception:

        return {

            "status": "offline",

            "message": "Gemini unavailable"

        }

# ======================================================
# Local Testing
# ======================================================

if __name__ == "__main__":

    sample = """
A 50-year-old man suddenly collapses and is not breathing.
"""

    result = generate_ai_response(sample)

    print(json.dumps(result, indent=4))