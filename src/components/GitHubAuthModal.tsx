import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGitHubAuth } from '@/context/GitHubAuthContext';
import { Github, KeyRound, ExternalLink, Zap, ShieldCheck, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export function GitHubAuthModal() {
  const { isLoginModalOpen, closeLoginModal, loginWithToken, loginWithDemo, isLoading } = useGitHubAuth();
  const [tokenInput, setTokenInput] = useState('');

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      await loginWithToken(tokenInput.trim());
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={(open) => !open && closeLoginModal()}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/80 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-foreground">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Connect to GitHub
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Authenticate to unlock 5,000 API requests/hr and analyze your repositories directly.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs defaultValue="token" className="w-full pt-2">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/60">
            <TabsTrigger value="token" className="gap-2 text-xs">
              <KeyRound className="w-3.5 h-3.5" />
              Access Token (Fast)
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2 text-xs">
              <Zap className="w-3.5 h-3.5 text-primary" />
              1-Click Demo Account
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ACCESS TOKEN */}
          <TabsContent value="token" className="space-y-4 pt-3">
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gh-token" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    GitHub Personal Access Token (Classic or Fine-grained)
                  </Label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=RepoMirror%20Code%20Review"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Generate on GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <Input
                  id="gh-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="font-mono text-sm h-11 bg-background/60 border-border/60"
                />

                <div className="text-xs text-muted-foreground space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Increases GitHub rate limit from 60 to 5,000 requests/hour</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Only requires standard <code className="text-primary font-mono">read:user</code> scope</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your token is saved only in local storage on this browser and is never stored on a database.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={closeLoginModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  size="sm"
                  disabled={!tokenInput.trim() || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      Sign in with Token
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB 2: DEMO ACCOUNT */}
          <TabsContent value="demo" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/30 to-background border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                Test Drive Developer Mode
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Want to test out the authenticated developer experience without generating a GitHub token right now? 
                Sign in using our interactive demo developer profile with sample repositories preloaded.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://avatars.githubusercontent.com/u/9919?v=4"
                  alt="Demo avatar"
                  className="w-10 h-10 rounded-full border border-border"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">RepoMirror Engineer</p>
                  <p className="text-[11px] text-muted-foreground">@developer • 18 Repositories</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={closeLoginModal}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="hero"
                size="sm"
                onClick={loginWithDemo}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Continue with Demo Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
