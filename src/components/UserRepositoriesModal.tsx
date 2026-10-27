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
import { Badge } from '@/components/ui/badge';
import { useGitHubAuth } from '@/context/GitHubAuthContext';
import { Search, GitFork, Star, FolderGit2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface UserRepositoriesModalProps {
  onSelectRepo: (repoUrl: string) => void;
}

export function UserRepositoriesModal({ onSelectRepo }: UserRepositoriesModalProps) {
  const { user, repos, isReposModalOpen, closeReposModal, isLoadingRepos, refreshRepos } = useGitHubAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepos = repos.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  });

  const handleSelect = (repoUrl: string) => {
    closeReposModal();
    onSelectRepo(repoUrl);
  };

  return (
    <Dialog open={isReposModalOpen} onOpenChange={(open) => !open && closeReposModal()}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/80 shadow-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-primary" />
              <DialogTitle className="text-xl font-bold text-foreground">
                Your GitHub Repositories
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRepos}
              disabled={isLoadingRepos}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRepos ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Select any repository from @{user?.login} to run an instant deep code review.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name, description, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm bg-background/60"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1 max-h-[50vh]">
          {isLoadingRepos ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">Fetching repositories from GitHub...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              No repositories found matching "{searchQuery}".
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="group p-3.5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/50 hover:border-primary/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => handleSelect(repo.htmlUrl || `https://github.com/${repo.fullName}`)}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </span>
                    {repo.private ? (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-amber-500/30 text-amber-400">
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                        Public
                      </Badge>
                    )}
                    {repo.language && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-border">
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks}
                    </span>
                    <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="hero"
                  className="shrink-0 h-8 px-3 text-xs gap-1.5 opacity-90 group-hover:opacity-100"
                >
                  Analyze
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
