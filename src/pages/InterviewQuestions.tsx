
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { generateInterviewQuestions, InterviewQuestion, uploadFile } from "@/services/api";
import FileUpload from "@/components/FileUpload";
import Navbar from "@/components/Navbar";

const InterviewQuestions = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobSpecFile, setJobSpecFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobSpecId, setJobSpecId] = useState<string | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isUploading, setIsUploading] = useState({
    jobSpec: false,
    cv: false,
  });

  const handleJobSpecUpload = async (file: File) => {
    setJobSpecFile(file);
    setIsUploading(prev => ({ ...prev, jobSpec: true }));
    
    try {
      const response = await uploadFile(file);
      setJobSpecId(response.id);
      toast({
        title: "Job Specification Uploaded",
        description: "Your job specification file was successfully uploaded."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your job specification.",
        variant: "destructive"
      });
      setJobSpecFile(null);
    } finally {
      setIsUploading(prev => ({ ...prev, jobSpec: false }));
    }
  };

  const handleCvUpload = async (file: File) => {
    setCvFile(file);
    setIsUploading(prev => ({ ...prev, cv: true }));
    
    try {
      const response = await uploadFile(file);
      setCvId(response.id);
      toast({
        title: "CV Uploaded",
        description: "Your CV file was successfully uploaded."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your CV.",
        variant: "destructive"
      });
      setCvFile(null);
    } finally {
      setIsUploading(prev => ({ ...prev, cv: false }));
    }
  };

  const handleGenerateQuestions = async () => {
    if (!jobSpecId || !cvId) {
      toast({
        title: "Missing Files",
        description: "Please upload both a job specification and CV.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedQuestions = await generateInterviewQuestions(jobSpecId, cvId);
      setQuestions(generatedQuestions);
      toast({
        title: "Questions Generated",
        description: "Interview questions have been generated successfully."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the interview questions.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const categorizedQuestions: Record<string, InterviewQuestion[]> = {};
  questions.forEach((question) => {
    if (!categorizedQuestions[question.category]) {
      categorizedQuestions[question.category] = [];
    }
    categorizedQuestions[question.category].push(question);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="ubs-container pt-20 pb-10">
        <div className="my-8">
          <h1 className="text-3xl font-semibold text-ubs-darkgray mb-2">Interview Question Generator</h1>
          <p className="text-gray-600">Create tailored interview questions based on job specifications and CVs</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-6 ubs-heading">Upload Documents</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FileUpload 
                  label="Upload Job Specification"
                  acceptedFileTypes=".pdf,.doc,.docx,.txt"
                  onFileUpload={handleJobSpecUpload}
                />
                {isUploading.jobSpec && (
                  <div className="mt-2 flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2 text-ubs-red" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>

              <div>
                <FileUpload 
                  label="Upload CV"
                  acceptedFileTypes=".pdf,.doc,.docx,.txt"
                  onFileUpload={handleCvUpload}
                />
                {isUploading.cv && (
                  <div className="mt-2 flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2 text-ubs-red" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleGenerateQuestions}
              className="mt-6 w-full bg-ubs-red hover:bg-ubs-red/90"
              disabled={isGenerating || !jobSpecId || !cvId}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : "Generate Interview Questions"}
            </Button>
          </CardContent>
        </Card>

        {isGenerating ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-ubs-red" />
          </div>
        ) : questions.length > 0 ? (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-6 ubs-heading">Generated Interview Questions</h2>
              
              <Tabs defaultValue={Object.keys(categorizedQuestions)[0]}>
                <TabsList className="mb-6 bg-gray-100">
                  {Object.keys(categorizedQuestions).map((category) => (
                    <TabsTrigger key={category} value={category} className="data-[state=active]:bg-white">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(categorizedQuestions).map(([category, categoryQuestions]) => (
                  <TabsContent key={category} value={category}>
                    <ul className="space-y-4">
                      {categoryQuestions.map((question) => (
                        <li key={question.id} className="p-4 bg-white rounded-md shadow-sm border border-gray-100">
                          <span className="block text-ubs-darkgray">{question.question}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
};

export default InterviewQuestions;
