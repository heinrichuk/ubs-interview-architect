
// API service for interacting with FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export type JobSpecPrompt = {
  role: string;
  department: string;
  experience: string;
  skills: string;
  location: string;
};

export type InterviewQuestion = {
  id: number;
  category: string;
  question: string;
};

export const generateJobSpec = async (prompt: JobSpecPrompt): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-job-spec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error('Failed to generate job specification');
    }

    const data = await response.json();
    return data.job_spec;
  } catch (error) {
    console.error('Error generating job specification:', error);
    throw error;
  }
};

export const uploadFile = async (file: File): Promise<{ id: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const generateInterviewQuestions = async (
  jobSpecId: string,
  cvId: string
): Promise<InterviewQuestion[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-interview-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_spec_id: jobSpecId, cv_id: cvId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate interview questions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw error;
  }
};

