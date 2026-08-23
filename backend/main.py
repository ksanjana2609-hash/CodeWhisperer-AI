import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Gemini API
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)

MODEL = "gemini-3.6-flash"

# Create FastAPI app
app = FastAPI(title="CodeWhisperer AI")


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "CodeWhisperer AI backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


def ask_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text


@app.post("/ask")
async def ask_question(data: dict):
    question = data.get("question") or data.get("message")

    if not question:
        return {"answer": "Please enter a question."}

    prompt = f"""
You are CodeWhisperer AI, a beginner-friendly programming tutor.

Your goal is to help students understand programming.

Do NOT immediately give the complete solution unless it is necessary.

For programming questions:
1. Explain the concept simply.
2. Give a small hint.
3. Explain the approach.
4. Give code when appropriate.
5. Explain the code briefly.
6. Mention time and space complexity when relevant.

Question:
{question}
"""

    try:
        answer = ask_gemini(prompt)

        return {
            "answer": answer
        }

    except Exception as e:
        return {
            "answer": "Error while contacting Gemini: " + str(e)
        }


@app.post("/upload_code")
async def upload_code(file: UploadFile = File(...)):
    try:
        content = await file.read()

        code = content.decode("utf-8", errors="ignore")

        if not code.strip():
            return {
                "answer": "The uploaded file is empty."
            }

        prompt = f"""
You are CodeWhisperer AI, a beginner-friendly programming tutor.

Analyze the following source code.

Explain:

1. What the code does
2. Important parts
3. Time Complexity
4. Space Complexity
5. Bugs or errors
6. Improvements

Keep the explanation simple and beginner-friendly.

If there are no major bugs, clearly say:
"No major bugs found."

Source Code:

{code}
"""

        answer = ask_gemini(prompt)

        return {
            "answer": answer
        }

    except Exception as e:
        return {
            "answer": "File upload error: " + str(e)
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )