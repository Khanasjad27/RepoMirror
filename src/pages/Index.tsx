import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  score: number;
  summary: string;
  roadmap: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  metrics: {
    codeQuality: number;
    documentation: number;
    testing: number;
    structure: number;
  };
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setAnalyzedUrl(url);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-repo', {
        body: { repoUrl: url },
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error(error.message || 'Failed to analyze repository');
        setIsLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      setResult({
        score: data.score,
        summary: data.summary,
        roadmap: data.roadmap,
        metrics: data.metrics,
      });

      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnalyzedUrl("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {!result ? (
          <>
            <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            <LandingSections />
          </>
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
            
            <AnalysisResults result={result} repoUrl={analyzedUrl} onReset={handleReset} />
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for students, by engineers who care about code quality.</p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} RepoMirror. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
