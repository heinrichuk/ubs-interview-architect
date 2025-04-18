
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { generateJobSpec, JobSpecPrompt } from "@/services/api";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobSpec, setJobSpec] = useState("");
  const [prompt, setPrompt] = useState<JobSpecPrompt>({
    role: "",
    department: "",
    experience: "",
    skills: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    // Validate inputs
    if (!prompt.role || !prompt.department) {
      toast({
        title: "Missing information",
        description: "Please provide at least a role and department",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedSpec = await generateJobSpec(prompt);
      setJobSpec(generatedSpec);
      toast({
        title: "Job Specification Generated",
        description: "Your job specification has been successfully created."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the job specification.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jobSpec);
    toast({
      title: "Copied to clipboard",
      description: "Job specification copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="ubs-container pt-20 pb-10">
        <div className="my-8">
          <h1 className="text-3xl font-semibold text-ubs-darkgray mb-2">Job Specification Generator</h1>
          <p className="text-gray-600">Create professional job descriptions with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 ubs-heading">Input Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Role/Title*
                  </label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="e.g. Senior Software Engineer"
                    value={prompt.role}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department/Team*
                  </label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g. Technology, Investment Banking"
                    value={prompt.department}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <Input
                    id="experience"
                    name="experience"
                    placeholder="e.g. 5+ years, Entry Level"
                    value={prompt.experience}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g. Java, Python, Financial Analysis"
                    value={prompt.skills}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Zurich, London, New York"
                    value={prompt.location}
                    onChange={handleChange}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  className="w-full bg-ubs-red hover:bg-ubs-red/90"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate Job Specification"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium ubs-heading">Generated Job Specification</h2>
                <Button 
                  onClick={handleCopy} 
                  variant="outline" 
                  size="sm"
                  disabled={!jobSpec}
                >
                  Copy
                </Button>
              </div>
              <div className="min-h-[400px] bg-gray-50 rounded-md p-4 border border-gray-100">
                {isGenerating ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-ubs-red" />
                  </div>
                ) : jobSpec ? (
                  <pre className="whitespace-pre-wrap text-sm">{jobSpec}</pre>
                ) : (
                  <div className="text-gray-400 text-center flex flex-col justify-center items-center h-full">
                    <p>Complete the form and click "Generate Job Specification"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
