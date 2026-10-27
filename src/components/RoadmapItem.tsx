import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Tag, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RoadmapItemProps {
  step: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  effort?: string;
  category?: string;
  delay?: number;
}

export function RoadmapItem({
  step,
  title,
  description,
  priority,
  effort,
  category,
  delay = 0,
}: RoadmapItemProps) {
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityStyles = {
    high: "border-l-rose-500 bg-rose-500/[0.03] hover:border-l-rose-400",
    medium: "border-l-amber-500 bg-amber-500/[0.03] hover:border-l-amber-400",
    low: "border-l-emerald-500 bg-emerald-500/[0.03] hover:border-l-emerald-400",
  };

  const priorityBadge = {
    high: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`[Task: ${title}]\n${description}`);
    setCopied(true);
    toast.success("Action item copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl border-l-[3px] border border-border/70 bg-card/40 hover:bg-card/80 transition-all duration-200",
        priorityStyles[priority],
        completed && "opacity-60 bg-secondary/20"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Toggle Complete Checkbox */}
        <button
          type="button"
          onClick={() => setCompleted(!completed)}
          className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          title={completed ? "Mark as in-progress" : "Mark as completed"}
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-border/80 group-hover:border-primary/60 flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground">
              {step}
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn(
                "font-semibold text-sm sm:text-base text-foreground group-hover:text-primary/95 transition-colors",
                completed && "line-through text-muted-foreground"
              )}
            >
              {title}
            </h4>

            {/* Priority */}
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                priorityBadge[priority]
              )}
            >
              {priority}
            </span>

            {/* Category */}
            {category && (
              <Badge variant="outline" className="text-[10px] py-0 px-2 border-border/80 text-muted-foreground flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" />
                {category}
              </Badge>
            )}

            {/* Effort */}
            {effort && (
              <Badge variant="secondary" className="text-[10px] py-0 px-2 text-muted-foreground/80 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {effort}
              </Badge>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Copy action button */}
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
          title="Copy task details"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
