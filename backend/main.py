
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
import openai
import json
from datetime import datetime
import shutil

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

# Create storage directories if they don't exist
UPLOAD_DIR = "storage/uploads"
SPECS_DIR = "storage/job_specs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SPECS_DIR, exist_ok=True)

class JobSpecPrompt(BaseModel):
    role: str
    department: str
    experience: str
    skills: str
    location: str

class InterviewQuestionRequest(BaseModel):
    job_spec_id: str
    cv_id: str

def save_job_spec(content: str) -> str:
    """Save a job specification to disk and return its ID"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    spec_id = f"spec_{timestamp}"
    
    spec_path = os.path.join(SPECS_DIR, f"{spec_id}.txt")
    with open(spec_path, "w") as f:
        f.write(content)
    
    return spec_id

def get_job_spec(spec_id: str) -> str:
    """Retrieve a job specification from disk"""
    spec_path = os.path.join(SPECS_DIR, f"{spec_id}.txt")
    if not os.path.exists(spec_path):
        raise HTTPException(status_code=404, detail="Job specification not found")
    
    with open(spec_path, "r") as f:
        return f.read()

@app.post("/api/generate-job-spec")
async def generate_job_spec(prompt: JobSpecPrompt):
    try:
        response = openai.ChatCompletion.create(
            engine=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
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
        
        job_spec = response.choices[0].message.content
        spec_id = save_job_spec(job_spec)
        
        return {"job_spec": job_spec, "spec_id": spec_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_id = f"file_{timestamp}"
        return {"id": file_id, "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-interview-questions")
async def generate_interview_questions(request: InterviewQuestionRequest):
    try:
        # Get the job spec content
        job_spec = get_job_spec(request.job_spec_id)
        
        # Get the CV content (assuming it's a text file)
        cv_path = os.path.join(UPLOAD_DIR, f"{request.cv_id}.txt")
        if not os.path.exists(cv_path):
            raise HTTPException(status_code=404, detail="CV not found")
        
        with open(cv_path, "r") as f:
            cv_content = f.read()
        
        response = openai.ChatCompletion.create(
            engine=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            messages=[
                {"role": "system", "content": "You are an expert interviewer."},
                {"role": "user", "content": f"""Generate 5 relevant interview questions based on this job specification:
                {job_spec}
                
                And this CV:
                {cv_content}"""}
            ],
            temperature=0.7,
            max_tokens=500,
        )
        
        # Parse the response into structured questions
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
