import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Github, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onAnalyze(repoUrl.trim());
    }
  };

  const handleDemo = () => {
    onAnalyze("https://github.com/facebook/react");
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">AI-Powered Repository Analysis</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Your Code's </span>
            <span className="text-gradient">True Mirror</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get honest, actionable feedback on your GitHub repositories. 
            Real scores. Expert insights. Personalized roadmaps.
          </p>
        </div>

        {/* Search Form */}
        <form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-12 h-14 text-base"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              size="xl" 
              variant="hero"
              disabled={!repoUrl.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-muted-foreground">or</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={handleDemo}
              disabled={isLoading}
              className="text-primary hover:text-primary/90"
            >
              <Search className="w-4 h-4 mr-1" />
              Try demo analysis
            </Button>
          </div>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
          {[
            { title: "Code Quality", desc: "Analyze structure, readability & best practices" },
            { title: "Real Scores", desc: "Industry-standard evaluation, no inflated grades" },
            { title: "Action Plan", desc: "Personalized roadmap with priority steps" },
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-lg bg-card/30 border border-border/50 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
