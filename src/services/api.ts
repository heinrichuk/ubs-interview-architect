
// This file will handle API calls to our FastAPI backend

const API_BASE_URL = "http://localhost:8000/api";

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

// Mock implementation - in a real app, this would connect to FastAPI backend
export const generateJobSpec = async (prompt: JobSpecPrompt): Promise<string> => {
  console.log("Generating job spec with prompts:", prompt);
  
  // This is a mock - in production, this would call the FastAPI endpoint 
  // that interfaces with Azure OpenAI
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
# ${prompt.role} - ${prompt.department}

## Job Description
We are seeking an experienced ${prompt.role} to join our ${prompt.department} team. The ideal candidate will have ${prompt.experience} experience and be located in ${prompt.location}.

## Requirements
- ${prompt.experience} of relevant experience
- Strong skills in ${prompt.skills}
- Excellent communication and teamwork abilities
- Ability to work in ${prompt.location} or remotely as required

## Responsibilities
- Collaborate with cross-functional teams
- Drive innovation in ${prompt.department}
- Implement best practices and methodologies
- Provide expertise in ${prompt.skills}
      `);
    }, 2000);
  });
};

export const uploadFile = async (file: File): Promise<{ id: string }> => {
  console.log("Uploading file:", file.name);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "file-" + Math.random().toString(36).substring(2, 9) });
    }, 1500);
  });
};

export const generateInterviewQuestions = async (
  jobSpecId: string,
  cvId: string
): Promise<InterviewQuestion[]> => {
  console.log("Generating interview questions for job spec:", jobSpecId, "and CV:", cvId);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          category: "Technical Skills",
          question: "Can you explain your experience with the technologies mentioned in your CV?"
        },
        {
          id: 2,
          category: "Experience",
          question: "How does your background in previous roles prepare you for this position?"
        },
        {
          id: 3,
          category: "Problem Solving",
          question: "Describe a challenging problem you faced and how you solved it."
        },
        {
          id: 4,
          category: "Cultural Fit",
          question: "How would you describe your approach to working in a team environment?"
        },
        {
          id: 5,
          category: "Role-Specific",
          question: `What attracts you to this specific role and how do you see yourself contributing?`
        }
      ]);
    }, 2000);
  });
};
