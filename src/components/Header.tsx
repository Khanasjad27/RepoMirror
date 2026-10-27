import { useState } from 'react';
import { Github, Code2, Menu, X, FolderGit2, LogOut, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGitHubAuth } from '@/context/GitHubAuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal, logout, openReposModal } = useGitHubAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">RepoMirror</span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] px-1.5 py-0 border-primary/30 text-primary">
              AI Staff Reviewer
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('evaluation-criteria')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Criteria
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            FAQ
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* GitHub User Auth / Connect Button */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 pl-2 pr-3 gap-2 border-border/80 bg-secondary/30 hover:bg-secondary/60"
                >
                  <Avatar className="w-6 h-6 border border-border">
                    <AvatarImage src={user.avatarUrl} alt={user.login} />
                    <AvatarFallback className="text-xs">{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium max-w-[90px] truncate hidden sm:inline">
                    @{user.login}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/80">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{user.name || user.login}</p>
                    <p className="text-xs text-muted-foreground">@{user.login}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>5,000 requests/hr active</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openReposModal} className="gap-2 cursor-pointer text-xs">
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  My Repositories ({user.publicRepos})
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer text-xs">
                  <a href={user.htmlUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    Open GitHub Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={openLoginModal}
              className="gap-2 h-9 border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-foreground transition-all"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Sign in with GitHub</span>
              <span className="sm:hidden font-medium">Sign in</span>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-muted-foreground hover:text-foreground text-left py-2 font-medium"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('evaluation-criteria')}
              className="text-sm text-muted-foreground hover:text-foreground text-left py-2 font-medium"
            >
              Evaluation Criteria
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-muted-foreground hover:text-foreground text-left py-2 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm text-muted-foreground hover:text-foreground text-left py-2 font-medium"
            >
              FAQ
            </button>
            <div className="pt-2 flex flex-col gap-2">
              {!isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={openLoginModal} className="w-full justify-start gap-2">
                  <Github className="w-4 h-4" />
                  Sign in with GitHub
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={openReposModal} className="w-full justify-start gap-2">
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  My Repositories
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
