import json

from google import genai
from django.conf import settings


def analyze_emergency(description):

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    system_prompt = """
You are an Emergency AI Assistant.

Analyze the user's emergency description.

Return ONLY valid JSON.

Format:

{
  "emergency_type":"",
  "priority":"",
  "summary":"",
  "first_aid":[],
  "disclaimer":""
}

Rules:

- Stay calm.
- Never diagnose diseases.
- Recommend emergency services for critical cases.
- Keep the response under 150 words.
- Do not return markdown.
"""

    try:

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=f"""
{system_prompt}

User:

{description}
"""

        )

        text = response.text.strip()

        return json.loads(text)

    except Exception:

        return {

            "emergency_type": "Unknown",

            "priority": "High",

            "summary": "Unable to analyze the emergency at this time.",

            "first_aid": [

                "Stay calm.",

                "Contact emergency services if necessary."

            ],

            "disclaimer": "AI service temporarily unavailable."

        }