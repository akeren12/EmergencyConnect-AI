import requests

url = "http://127.0.0.1:8000/api/ai/analyze/"

for i in range(50):
    response = requests.post(
        url,
        json={
            "description":
            f"There is a fire emergency number {i}"
        }
    )

    print(
        f"Request {i+1}: {response.status_code}"
    )