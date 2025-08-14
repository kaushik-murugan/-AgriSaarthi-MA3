from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import google.generativeai as genai
import os
from dotenv import load_dotenv
from prompt_template import SYSTEM_PROMPT

load_dotenv()

app = FastAPI()

# CORS so your React Native app can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Gemini API key
# Make sure to set the GOOGLE_API_KEY environment variable
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

@app.post("/ask")
async def ask(
    question: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    location: Optional[str] = Form(None)
):
    # TODO: integrate Langchain RAG + MA3 model here
    # Currently returning a sample payload
    return {
        "answer": f"Sample answer for question: {question}",
        "confidence": 0.92,
        "explanation": "This is a placeholder explanation.",
        "sources": ["AgriGenius docs", "ICAR reports"]
    }

@app.post("/gemini-ask")
async def gemini_ask(    question: str = Form(...),    image: Optional[UploadFile] = File(None),):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"{SYSTEM_PROMPT}\n\nUser question: {question}"
        if image:
            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            image_data = await image.read()
            image_parts = [
                {
                    "mime_type": image.content_type,
                    "data": image_data
                }
            ]
            response = model.generate_content([prompt, image_parts[0]])
        else:
            response = model.generate_content(prompt)

        if response.text:
            return {"answer": response.text}
        else:
            # The Gemini API returned a 200 OK but the response text was empty.
            # We can inspect the full response to see why.
            print(f"Empty response from Gemini: {response}")
            return {"answer": f"The API returned an empty response. Full response: {response}"}

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {"answer": f"An error occurred while calling the API: {e}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
