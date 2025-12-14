import { Github, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">RepoMirror</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </nav>

        <Button variant="outline" size="sm" className="gap-2">
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Sign in with GitHub</span>
          <span className="sm:hidden">Sign in</span>
        </Button>
      </div>
    </header>
  );
}
