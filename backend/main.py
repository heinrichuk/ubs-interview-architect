
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Azure OpenAI
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2023-05-15"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")

class JobSpecPrompt(BaseModel):
    role: str
    department: str
    experience: str
    skills: str
    location: str

class InterviewQuestionRequest(BaseModel):
    job_spec_id: str
    cv_id: str

@app.post("/api/generate-job-spec")
async def generate_job_spec(prompt: JobSpecPrompt):
    try:
        response = openai.ChatCompletion.create(
            engine="your-deployment-name",  # Replace with your Azure OpenAI deployment name
            messages=[
                {"role": "system", "content": "You are a professional job specification writer."},
                {"role": "user", "content": f"""Create a job specification for:
                Role: {prompt.role}
                Department: {prompt.department}
                Experience: {prompt.experience}
                Skills: {prompt.skills}
                Location: {prompt.location}"""}
            ],
            temperature=0.7,
            max_tokens=800,
        )
        
        return {"job_spec": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # In a real application, you would:
        # 1. Validate the file
        # 2. Save it to a secure location
        # 3. Process it as needed
        file_id = f"file-{os.urandom(4).hex()}"
        return {"id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-interview-questions")
async def generate_interview_questions(request: InterviewQuestionRequest):
    try:
        # In a real application, you would:
        # 1. Retrieve the job spec and CV content using the provided IDs
        # 2. Process them to generate relevant questions
        response = openai.ChatCompletion.create(
            engine="your-deployment-name",  # Replace with your Azure OpenAI deployment name
            messages=[
                {"role": "system", "content": "You are an expert interviewer."},
                {"role": "user", "content": f"Generate 5 interview questions based on job specification ID {request.job_spec_id} and CV ID {request.cv_id}"}
            ],
            temperature=0.7,
            max_tokens=500,
        )
        
        # For demo purposes, returning structured questions
        questions = [
            {"id": i, "category": "Technical", "question": q.strip()} 
            for i, q in enumerate(response.choices[0].message.content.split('\n'), 1)
            if q.strip()
        ]
        
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

