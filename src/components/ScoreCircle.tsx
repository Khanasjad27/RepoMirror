import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  letterGrade?: string;
  size?: number;
  strokeWidth?: number;
}

export function ScoreCircle({
  score,
  letterGrade,
  size = 220,
  strokeWidth = 14,
}: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 85) return "stroke-emerald-400";
    if (s >= 70) return "stroke-teal-400";
    if (s >= 55) return "stroke-amber-400";
    return "stroke-rose-400";
  };

  const getGlowColor = (s: number) => {
    if (s >= 85) return "drop-shadow-[0_0_18px_rgba(52,211,153,0.35)]";
    if (s >= 70) return "drop-shadow-[0_0_18px_rgba(45,212,191,0.35)]";
    if (s >= 55) return "drop-shadow-[0_0_18px_rgba(251,191,36,0.35)]";
    return "drop-shadow-[0_0_18px_rgba(251,113,133,0.35)]";
  };

  const getBadgeStyle = (s: number) => {
    if (s >= 85) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (s >= 70) return "bg-teal-500/15 text-teal-300 border-teal-500/30";
    if (s >= 55) return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  };

  const getScoreVerdict = (s: number) => {
    if (s >= 90) return "Production Ready";
    if (s >= 75) return "Strong Codebase";
    if (s >= 60) return "Competent";
    if (s >= 45) return "Needs Architecture Polish";
    return "Early Prototype";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className={cn("-rotate-90", getGlowColor(score))}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-secondary/60"
        />
        {/* Progress Arc */}
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

      <div className="absolute flex flex-col items-center justify-center text-center px-4">
        {letterGrade && (
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/80 font-bold mb-0.5">
            Grade {letterGrade}
          </span>
        )}
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-5xl sm:text-6xl font-black text-foreground font-display tracking-tight">
            {animatedScore}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">/100</span>
        </div>
        <span
          className={cn(
            "text-[11px] font-semibold mt-2 px-2.5 py-0.5 rounded-full border backdrop-blur-sm whitespace-nowrap",
            getBadgeStyle(score)
          )}
        >
          {getScoreVerdict(score)}
        </span>
      </div>
    </div>
  );
}
