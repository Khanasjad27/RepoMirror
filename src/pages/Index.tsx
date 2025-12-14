import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock analysis result for demo
const mockResult = {
  score: 72,
  summary: "This repository demonstrates solid fundamentals with good code organization and consistent commit history. The documentation could be improved with more detailed setup instructions and API references. Test coverage is below industry standards at roughly 35%, which presents maintainability risks. The technology stack is modern and appropriate for the project scope.",
  roadmap: [
    {
      title: "Add Comprehensive Testing",
      description: "Implement unit tests for core utilities and integration tests for main features. Aim for at least 70% code coverage to ensure maintainability.",
      priority: "high" as const,
    },
    {
      title: "Enhance README Documentation",
      description: "Add detailed setup instructions, API documentation, and contribution guidelines. Include screenshots or GIFs demonstrating key features.",
      priority: "high" as const,
    },
    {
      title: "Implement Consistent Error Handling",
      description: "Create a centralized error handling pattern across the codebase. Add proper try-catch blocks and user-friendly error messages.",
      priority: "medium" as const,
    },
    {
      title: "Add TypeScript Strict Mode",
      description: "Enable strict TypeScript configuration to catch potential runtime errors at compile time. Fix any resulting type errors.",
      priority: "medium" as const,
    },
    {
      title: "Set Up CI/CD Pipeline",
      description: "Configure GitHub Actions for automated testing, linting, and deployment. This ensures code quality on every pull request.",
      priority: "medium" as const,
    },
    {
      title: "Refactor Large Components",
      description: "Break down components exceeding 200 lines into smaller, reusable pieces. This improves readability and testability.",
      priority: "low" as const,
    },
  ],
  metrics: {
    codeQuality: 75,
    documentation: 58,
    testing: 35,
    structure: 82,
  },
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setAnalyzedUrl(url);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setResult(mockResult);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setAnalyzedUrl("");
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {!result ? (
          <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <section className="container mx-auto px-4 py-12">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="mb-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Analyze another repository
            </Button>
            
            <AnalysisResults result={result} repoUrl={analyzedUrl} />
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for students, by engineers who care about code quality.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
