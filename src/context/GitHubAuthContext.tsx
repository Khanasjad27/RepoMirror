import React, { createContext, useContext, useState, useEffect } from 'react';
import { GitHubUser, GitHubRepoSummary, verifyGitHubToken, fetchUserRepositories } from '@/services/github';
import { toast } from 'sonner';

interface GitHubAuthContextType {
  user: GitHubUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  repos: GitHubRepoSummary[];
  isLoadingRepos: boolean;
  isLoginModalOpen: boolean;
  isReposModalOpen: boolean;
  loginWithToken: (token: string) => Promise<boolean>;
  loginWithDemo: () => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openReposModal: () => void;
  closeReposModal: () => void;
  refreshRepos: () => Promise<void>;
}

const GitHubAuthContext = createContext<GitHubAuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'repomirror_github_user';
const TOKEN_STORAGE_KEY = 'repomirror_github_token';

export const GitHubAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<GitHubRepoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReposModalOpen, setIsReposModalOpen] = useState(false);

  // Restore on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Silently verify and fetch repos in background
        verifyGitHubToken(savedToken)
          .then((verified) => {
            setUser(verified);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verified));
            fetchUserRepositories(savedToken)
              .then(setRepos)
              .catch(() => {});
          })
          .catch(() => {
            // Token might be revoked or demo mode
          });
      }
    } catch (e) {
      console.warn('Failed restoring GitHub session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = async (newToken: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const verified = await verifyGitHubToken(newToken);
      setUser(verified);
      setToken(newToken.trim());
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken.trim());
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verified));

      toast.success(`Welcome, @${verified.login}! GitHub account connected.`);
      setIsLoginModalOpen(false);

      // Fetch repos
      setIsLoadingRepos(true);
      fetchUserRepositories(newToken.trim())
        .then(setRepos)
        .catch(console.warn)
        .finally(() => setIsLoadingRepos(false));

      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate with GitHub.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = () => {
    const demoUser: GitHubUser = {
      login: 'developer',
      name: 'RepoMirror Engineer',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
      bio: 'Open Source Contributor & Fullstack Developer',
      publicRepos: 18,
      followers: 124,
      htmlUrl: 'https://github.com',
    };
    setUser(demoUser);
    setToken('demo_token');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'demo_token');
    setRepos([
      {
        id: 1,
        name: 'fullstack-saas-template',
        fullName: 'developer/fullstack-saas-template',
        description: 'Next.js 14, Tailwind, Prisma and Stripe integration',
        language: 'TypeScript',
        stars: 342,
        forks: 48,
        private: false,
        htmlUrl: 'https://github.com/facebook/react',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'distributed-cache-engine',
        fullName: 'developer/distributed-cache-engine',
        description: 'High throughput in-memory key-value cache written in Go',
        language: 'Go',
        stars: 189,
        forks: 22,
        private: false,
        htmlUrl: 'https://github.com/golang/go',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'ai-doc-search',
        fullName: 'developer/ai-doc-search',
        description: 'Semantic vector search using embeddings and LangChain',
        language: 'Python',
        stars: 520,
        forks: 67,
        private: false,
        htmlUrl: 'https://github.com/shadcn/ui',
        updatedAt: new Date().toISOString(),
      },
    ]);
    toast.success('Logged in with Demo Developer Account!');
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRepos([]);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    toast.info('Disconnected from GitHub.');
  };

  const refreshRepos = async () => {
    if (!token || token === 'demo_token') return;
    setIsLoadingRepos(true);
    try {
      const userRepos = await fetchUserRepositories(token);
      setRepos(userRepos);
    } catch {
      // ignore
    } finally {
      setIsLoadingRepos(false);
    }
  };

  return (
    <GitHubAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        repos,
        isLoadingRepos,
        isLoginModalOpen,
        isReposModalOpen,
        loginWithToken,
        loginWithDemo,
        logout,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        openReposModal: () => setIsReposModalOpen(true),
        closeReposModal: () => setIsReposModalOpen(false),
        refreshRepos,
      }}
    >
      {children}
    </GitHubAuthContext.Provider>
  );
};

export const useGitHubAuth = () => {
  const context = useContext(GitHubAuthContext);
  if (!context) {
    throw new Error('useGitHubAuth must be used within a GitHubAuthProvider');
  }
  return context;
};
