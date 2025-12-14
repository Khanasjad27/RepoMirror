import { Lightbulb, BookOpen, TestTube, GitBranch, FileText, Rocket, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  {
    icon: FileText,
    title: "Write a Great README",
    description: "Include project description, setup instructions, screenshots, and usage examples.",
  },
  {
    icon: TestTube,
    title: "Add Unit Tests",
    description: "Even basic tests show employers you understand code quality and reliability.",
  },
  {
    icon: GitBranch,
    title: "Use Meaningful Commits",
    description: "Write clear commit messages that explain what and why, not just 'fixed bug'.",
  },
  {
    icon: Rocket,
    title: "Set Up CI/CD",
    description: "GitHub Actions is free - add automated testing and linting to your workflow.",
  },
];

interface ThankYouSectionProps {
  onAnalyzeAnother: () => void;
  repoName: string;
}

export function ThankYouSection({ onAnalyzeAnother, repoName }: ThankYouSectionProps) {
  const handleShare = () => {
    const text = `Just analyzed my GitHub repo "${repoName}" with RepoMirror! 🚀 Get honest code reviews and improvement roadmaps.`;
    if (navigator.share) {
      navigator.share({ text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  return (
    <div className="mt-16 space-y-12">
      {/* Thank You Card */}
      <div className="gradient-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          Thanks for using RepoMirror!
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          We hope this analysis helps you improve your repository. Remember, every great developer started somewhere - keep learning and building!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="hero" onClick={onAnalyzeAnother}>
            Analyze Another Repo
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Tips & Tricks */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Quick Tips to Boost Your Score</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="p-5 rounded-lg bg-card/50 border border-border/50 flex gap-4 hover:border-warning/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <tip.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Pro Tip</p>
            <p className="text-sm text-muted-foreground">
              Implement even 2-3 of these suggestions and re-analyze your repo. You'll likely see a 10-20 point score improvement!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
