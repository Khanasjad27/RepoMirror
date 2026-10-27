import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Github,
  Sparkles,
  ArrowRight,
  Loader2,
  FolderGit2,
  Zap,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useGitHubAuth } from '@/context/GitHubAuthContext';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  progressStage?: string;
}

const SAMPLE_REPOS = [
  { label: 'react', url: 'https://github.com/facebook/react', lang: 'JavaScript' },
  { label: 'shadcn/ui', url: 'https://github.com/shadcn/ui', lang: 'TypeScript' },
  { label: 'express', url: 'https://github.com/expressjs/express', lang: 'JavaScript' },
  { label: 'flask', url: 'https://github.com/pallets/flask', lang: 'Python' },
];

export function HeroSection({ onAnalyze, isLoading, progressStage }: HeroSectionProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const { isAuthenticated, user, openReposModal, openLoginModal } = useGitHubAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim() && !isLoading) {
      onAnalyze(repoUrl.trim());
    }
  };

  const handleSampleClick = (url: string) => {
    setRepoUrl(url);
    if (!isLoading) {
      onAnalyze(url);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 pt-12 pb-24 overflow-hidden">
      {/* Refined Ambient Glow & Grid Backdrop */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Top Intelligence Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border/80 backdrop-blur-md shadow-sm animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-foreground/90">
            Staff Engineer Review Logic • Powered by Google Gemini
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-xs font-mono text-primary font-medium">v2.0</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Mirror Your Code Through a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Senior Engineer's Eyes
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Honest, zero-fluff repository evaluations. Get realistic scores, architectural audits, and actionable roadmaps tailored for production standards.
          </p>
        </div>

        {/* Console Search Form */}
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <form
            onSubmit={handleSubmit}
            className="p-2 rounded-2xl bg-card/80 border border-border/80 backdrop-blur-xl shadow-2xl shadow-black/40 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center">
                <Github className="absolute left-4 w-5 h-5 text-muted-foreground shrink-0" />
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isLoading}
                  className="pl-12 pr-4 h-13 text-sm sm:text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isAuthenticated ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openReposModal}
                    disabled={isLoading}
                    className="h-11 px-3.5 gap-1.5 text-xs bg-secondary/40 border-border/80 text-foreground shrink-0"
                    title="Select from your own GitHub repositories"
                  >
                    <FolderGit2 className="w-4 h-4 text-primary" />
                    <span className="hidden md:inline">My Repos</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openLoginModal}
                    disabled={isLoading}
                    className="h-11 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0"
                    title="Sign in with GitHub for higher rate limits"
                  >
                    <Github className="w-3.5 h-3.5 mr-1" />
                    Sign in
                  </Button>
                )}

                <Button
                  type="submit"
                  size="lg"
                  variant="hero"
                  disabled={!repoUrl.trim() || isLoading}
                  className="h-11 px-6 text-sm font-semibold gap-2 w-full sm:w-auto shrink-0 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      Evaluate Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Live Progress Indicator during analysis */}
            {isLoading && (
              <div className="mt-3 pt-3 border-t border-border/40 px-3 pb-1 text-left space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-medium flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {progressStage || 'Connecting to GitHub API...'}
                  </span>
                  <span className="font-mono text-muted-foreground text-[11px]">AI Diagnostic Active</span>
                </div>
                <div className="w-full h-1.5 bg-secondary/80 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}
          </form>

          {/* Quick Sample Repositories */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="font-medium mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Try popular repos:
            </span>
            {SAMPLE_REPOS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleSampleClick(sample.url)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md bg-secondary/40 hover:bg-secondary border border-border/60 hover:border-primary/40 text-foreground/80 hover:text-foreground font-mono text-xs transition-all flex items-center gap-1.5"
              >
                <span>{sample.label}</span>
                <span className="text-[10px] text-muted-foreground font-sans">({sample.lang})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto text-left animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="p-4 rounded-xl bg-card/40 border border-border/60 backdrop-blur-sm space-y-1.5 hover:border-primary/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Deep Structural Audit</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Examines test coverage, CI workflows, typing strictness, and hygiene without sugarcoating.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card/40 border border-border/60 backdrop-blur-sm space-y-1.5 hover:border-primary/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Gemini Code Reasoning</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Synthesizes raw AST data and file trees into high-signal architectural roadmaps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card/40 border border-border/60 backdrop-blur-sm space-y-1.5 hover:border-primary/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Hiring Ready Roadmaps</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prioritized, time-estimated action items to turn student projects into recruiter magnets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
