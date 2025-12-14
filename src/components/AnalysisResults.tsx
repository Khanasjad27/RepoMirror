import { ScoreCircle } from "./ScoreCircle";
import { RoadmapItem } from "./RoadmapItem";
import { FileCode2, GitBranch, BookOpen, TestTube, Clock, Layers, GitCommit, Rocket } from "lucide-react";

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

interface AnalysisResultsProps {
  result: AnalysisResult;
  repoUrl: string;
}

export function AnalysisResults({ result, repoUrl }: AnalysisResultsProps) {
  const repoName = repoUrl.split("/").slice(-2).join("/");

  const metrics = [
    { label: "Code Quality", value: result.metrics.codeQuality, icon: FileCode2 },
    { label: "Documentation", value: result.metrics.documentation, icon: BookOpen },
    { label: "Test Coverage", value: result.metrics.testing, icon: TestTube },
    { label: "Structure", value: result.metrics.structure, icon: Layers },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 opacity-0 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
          <GitBranch className="w-4 h-4 text-primary" />
          <code className="text-sm font-mono text-foreground">{repoName}</code>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Analysis Complete</h2>
      </div>

      {/* Score & Summary Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="gradient-border p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-6">Overall Score</h3>
          <ScoreCircle score={result.score} />
        </div>

        {/* Summary Card */}
        <div className="gradient-border p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Summary
          </h3>
          <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label} 
            className="gradient-border p-5 text-center opacity-0 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <metric.icon className="w-6 h-6 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}%</div>
            <div className="text-xs text-muted-foreground font-medium">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-primary" />
          Personalized Improvement Roadmap
        </h3>
        <div className="space-y-3">
          {result.roadmap.map((item, index) => (
            <RoadmapItem
              key={index}
              step={index + 1}
              title={item.title}
              description={item.description}
              priority={item.priority}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
