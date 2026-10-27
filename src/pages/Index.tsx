import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { LandingSections } from '@/components/LandingSections';
import { AnalysisResults } from '@/components/AnalysisResults';
import { GeminiKeyModal } from '@/components/GeminiKeyModal';
import { GitHubAuthModal } from '@/components/GitHubAuthModal';
import { UserRepositoriesModal } from '@/components/UserRepositoriesModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code2, Github } from 'lucide-react';
import { toast } from 'sonner';
import { parseGitHubUrl, fetchGitHubRepoData, RepoMetadata } from '@/services/github';
import { analyzeRepositoryWithGemini, AnalysisResult } from '@/services/gemini';
import { useGitHubAuth } from '@/context/GitHubAuthContext';
import { useGeminiKey } from '@/context/GeminiKeyContext';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [repoData, setRepoData] = useState<RepoMetadata | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  const { token, openLoginModal } = useGitHubAuth();
  const { apiKey, hasKey, openKeyModal } = useGeminiKey();

  const handleAnalyze = async (url: string) => {
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      toast.error('Invalid GitHub URL. Please provide a link in format: https://github.com/owner/repository');
      return;
    }

    if (!hasKey) {
      toast.info('Please configure your Google Gemini API key to run evaluations.');
      openKeyModal();
      return;
    }

    setIsLoading(true);
    setProgressStage('Connecting to GitHub API...');
    setAnalyzedUrl(url);

    try {
      // 1. Fetch GitHub Repository Data
      const metadata = await fetchGitHubRepoData(
        parsed.owner,
        parsed.repo,
        (stage) => setProgressStage(stage),
        token
      );
      setRepoData(metadata);

      // 2. Perform Gemini AI Evaluation
      const analysis = await analyzeRepositoryWithGemini(
        metadata,
        apiKey,
        (stage) => setProgressStage(stage)
      );

      setResult(analysis);
      toast.success(`Evaluation complete for ${metadata.fullName}!`);

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      const message = err.message || 'An unexpected error occurred during repository analysis.';

      if (message === 'MISSING_GEMINI_KEY') {
        toast.error('Please configure your Gemini API Key in the settings dialog.');
        openKeyModal();
      } else if (message.includes('rate limit exceeded')) {
        toast.error(message);
        openLoginModal();
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
      setProgressStage('');
    }
  };

  const handleReset = () => {
    setResult(null);
    setRepoData(null);
    setAnalyzedUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      {/* Global Modals */}
      <GeminiKeyModal />
      <GitHubAuthModal />
      <UserRepositoriesModal onSelectRepo={handleAnalyze} />

      <div className="pt-16">
        {!result ? (
          <>
            <HeroSection
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              progressStage={progressStage}
            />
            <LandingSections />
          </>
        ) : (
          <section className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Evaluate Another Repository
              </Button>
            </div>

            <AnalysisResults
              result={result}
              repoData={repoData}
              repoUrl={analyzedUrl}
              onReset={handleReset}
            />
          </section>
        )}
      </div>

      {/* Professional Footer */}
      <footer className="border-t border-border/50 bg-secondary/10 py-12 mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">RepoMirror</p>
                <p className="text-xs text-muted-foreground">Senior Staff Code Review Intelligence</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground max-w-md">
              Evaluates repositories using senior engineering rubrics to mirror real-world recruiter and tech lead reviews.
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={openKeyModal}
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                API Settings
              </button>
              <span>•</span>
              <a
                href="https://github.com/Khanasjad27/RepoMirror"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <span>•</span>
              <span>© {new Date().getFullYear()} Asjad Khan</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
