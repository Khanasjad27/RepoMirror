import { Github, Code2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">RepoMirror</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Github className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
            >
              FAQ
            </button>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-center">
              <Github className="w-4 h-4" />
              <span>Sign in with GitHub</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
