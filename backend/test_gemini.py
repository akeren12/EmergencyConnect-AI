from google import genai

API_KEY = "AQ.Ab8RN6Jp9NTlee4MRqziiqHJsZH50UhCF3EM2kZyt9O4lP1KNg"

client = genai.Client(api_key=API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Reply with exactly: Hello"
)

print(response.text)