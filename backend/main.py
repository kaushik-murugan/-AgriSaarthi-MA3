from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn


app = FastAPI()

# CORS so your React Native app can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
