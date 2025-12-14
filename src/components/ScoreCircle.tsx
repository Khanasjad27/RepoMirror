import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreCircle({ score, size = 200, strokeWidth = 12 }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-success";
    if (score >= 60) return "stroke-primary";
    if (score >= 40) return "stroke-warning";
    return "stroke-destructive";
  };

  const getGlowClass = (score: number) => {
    if (score >= 80) return "glow-success";
    if (score >= 60) return "glow-primary";
    if (score >= 40) return "glow-warning";
    return "glow-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-full", getGlowClass(score))}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-1000 ease-out", getScoreColor(animatedScore))}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold text-foreground font-display">{animatedScore}</span>
        <span className="text-sm text-muted-foreground font-medium">/ 100</span>
        <span className={cn(
          "text-xs font-semibold mt-1 px-2 py-0.5 rounded-full",
          score >= 80 ? "bg-success/20 text-success" :
          score >= 60 ? "bg-primary/20 text-primary" :
          score >= 40 ? "bg-warning/20 text-warning" :
          "bg-destructive/20 text-destructive"
        )}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
