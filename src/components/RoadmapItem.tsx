import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface RoadmapItemProps {
  step: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  delay?: number;
}

export function RoadmapItem({ step, title, description, priority, delay = 0 }: RoadmapItemProps) {
  const priorityStyles = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-warning bg-warning/5",
    low: "border-l-success bg-success/5",
  };

  const priorityBadge = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-warning/20 text-warning",
    low: "bg-success/20 text-success",
  };

  return (
    <div 
      className={cn(
        "relative p-5 rounded-lg border-l-4 border border-border bg-card/50 opacity-0 animate-slide-in hover:bg-card transition-colors duration-200",
        priorityStyles[priority]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-sm font-bold text-primary font-mono">{step}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", priorityBadge[priority])}>
              {priority} priority
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <ArrowRight className="flex-shrink-0 w-5 h-5 text-muted-foreground/50" />
      </div>
    </div>
  );
}
