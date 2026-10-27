export interface GitHubFile {
  name: string;
  path: string;
  type: string;
  size?: number;
}

export interface RepoMetadata {
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
  };
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  hasReadme: boolean;
  readmeContent: string;
  hasTests: boolean;
  hasCI: boolean;
  hasLicense: boolean;
  licenseName: string | null;
  hasDocker: boolean;
  hasContributing: boolean;
  hasLinter: boolean;
  totalFiles: number;
  fileStructure: string[];
  languages: Record<string, number>;
  commits: number;
  contributors: number;
  lastUpdated: string;
  createdAt: string;
  topics: string[];
  packageJson: any | null;
  tsConfig: any | null;
  htmlUrl: string;
  defaultBranch: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  htmlUrl: string;
  token?: string;
}

export interface GitHubRepoSummary {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  private: boolean;
  htmlUrl: string;
  updatedAt: string;
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem('repomirror_github_token') || (import.meta.env.VITE_GITHUB_TOKEN as string) || null;
  } catch {
    return null;
  }
}

function buildHeaders(customToken?: string | null): HeadersInit {
  const token = customToken || getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ''),
  };
}

export async function fetchGitHubRepoData(
  owner: string,
  repo: string,
  onProgress?: (stage: string) => void,
  token?: string | null
): Promise<RepoMetadata> {
  const headers = buildHeaders(token);

  onProgress?.('Fetching repository metadata...');
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

  if (!repoRes.ok) {
    const status = repoRes.status;
    const rateRemaining = repoRes.headers.get('X-RateLimit-Remaining');
    if (status === 404) {
      throw new Error(`Repository "${owner}/${repo}" was not found. Please ensure it is public or connect a GitHub token.`);
    } else if (status === 403) {
      if (rateRemaining === '0') {
        throw new Error('GitHub API rate limit exceeded (60 req/hr). Click "Sign in with GitHub" to connect your GitHub token for 5,000 req/hr!');
      }
      throw new Error('GitHub API access was denied. You may need a GitHub token with repository permissions.');
    } else {
      throw new Error(`GitHub API error (${status}). Please verify the repository URL.`);
    }
  }

  const repoInfo = await repoRes.json();
  const defaultBranch = repoInfo.default_branch || 'main';

  onProgress?.('Scanning repository files and tree...');
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
    { headers }
  );
  const treeData = treeRes.ok ? await treeRes.json() : { tree: [] };
  const files: GitHubFile[] = treeData.tree || [];
  const filePaths = files.map((f: GitHubFile) => f.path);

  // Quality checks
  const hasTests = files.some((f) => {
    const p = f.path.toLowerCase();
    return (
      p.includes('/test/') ||
      p.includes('/tests/') ||
      p.includes('/__tests__/') ||
      p.includes('/spec/') ||
      p.endsWith('.test.ts') ||
      p.endsWith('.test.tsx') ||
      p.endsWith('.test.js') ||
      p.endsWith('.test.jsx') ||
      p.endsWith('.spec.ts') ||
      p.endsWith('.spec.js') ||
      p.endsWith('_test.go') ||
      p.endsWith('test.py') ||
      p.startsWith('tests/')
    );
  });

  const hasCI = files.some((f) => {
    const p = f.path.toLowerCase();
    return (
      p.includes('.github/workflows') ||
      p.includes('.gitlab-ci.yml') ||
      p.includes('.travis.yml') ||
      p.includes('.circleci') ||
      p.includes('jenkinsfile')
    );
  });

  const licenseFile = files.find((f) => f.path.toLowerCase().includes('license'));
  const hasLicense = !!licenseFile || !!repoInfo.license;
  const licenseName = repoInfo.license?.name || (licenseFile ? 'License file present' : null);

  const hasDocker = files.some((f) => {
    const p = f.path.toLowerCase();
    return p.includes('dockerfile') || p.includes('docker-compose');
  });

  const hasContributing = files.some((f) => {
    const p = f.path.toLowerCase();
    return p.includes('contributing.md') || p.includes('code_of_conduct.md');
  });

  const hasLinter = files.some((f) => {
    const p = f.path.toLowerCase();
    return (
      p.includes('.eslintrc') ||
      p.includes('eslint.config') ||
      p.includes('.prettierrc') ||
      p.includes('biome.json') ||
      p.includes('ruff.toml') ||
      p.includes('.golangci')
    );
  });

  onProgress?.('Inspecting documentation and README...');
  let readmeContent = '';
  const readmeFile = files.find((f) => f.path.toLowerCase() === 'readme.md');
  if (readmeFile) {
    try {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${readmeFile.path}`,
        { headers }
      );
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          const raw = atob(readmeData.content.replace(/\s/g, ''));
          readmeContent = decodeURIComponent(
            escape(raw)
          );
          if (readmeContent.length > 4000) {
            readmeContent = readmeContent.substring(0, 4000) + '\n... [truncated for evaluation]';
          }
        }
      }
    } catch (e) {
      console.warn('Could not read README content:', e);
    }
  }

  onProgress?.('Analyzing language distribution & dependencies...');
  let languages: Record<string, number> = {};
  try {
    const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (langRes.ok) languages = await langRes.json();
  } catch (e) {
    console.warn('Could not fetch languages:', e);
  }

  // Commits count
  let commits = 0;
  try {
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
    if (commitsRes.ok) {
      const link = commitsRes.headers.get('Link');
      if (link) {
        const match = link.match(/page=(\d+)>; rel="last"/);
        commits = match ? parseInt(match[1], 10) : 1;
      } else {
        commits = 1;
      }
    }
  } catch (e) {
    commits = 1;
  }

  // Contributors count
  let contributors = 0;
  try {
    const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`, { headers });
    if (contribRes.ok) {
      const link = contribRes.headers.get('Link');
      if (link) {
        const match = link.match(/page=(\d+)>; rel="last"/);
        contributors = match ? parseInt(match[1], 10) : 1;
      } else {
        contributors = 1;
      }
    }
  } catch (e) {
    contributors = 1;
  }

  // Package.json parsing
  let packageJson: any = null;
  const pkgFile = files.find((f) => f.path.toLowerCase() === 'package.json');
  if (pkgFile) {
    try {
      const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pkgFile.path}`, { headers });
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        const raw = atob(pkgData.content.replace(/\s/g, ''));
        packageJson = JSON.parse(decodeURIComponent(escape(raw)));
      }
    } catch (e) {
      console.warn('Could not parse package.json:', e);
    }
  }

  // tsconfig parsing
  let tsConfig: any = null;
  const tsConfigFile = files.find((f) => f.path.toLowerCase() === 'tsconfig.json');
  if (tsConfigFile) {
    try {
      const tsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${tsConfigFile.path}`, { headers });
      if (tsRes.ok) {
        const tsData = await tsRes.json();
        const raw = atob(tsData.content.replace(/\s/g, ''));
        tsConfig = JSON.parse(decodeURIComponent(escape(raw)));
      }
    } catch (e) {
      console.warn('Could not parse tsconfig:', e);
    }
  }

  return {
    name: repoInfo.name,
    fullName: repoInfo.full_name,
    owner: {
      login: repoInfo.owner?.login || owner,
      avatarUrl: repoInfo.owner?.avatar_url || '',
      htmlUrl: repoInfo.owner?.html_url || '',
    },
    description: repoInfo.description,
    language: repoInfo.language,
    stars: repoInfo.stargazers_count || 0,
    forks: repoInfo.forks_count || 0,
    openIssues: repoInfo.open_issues_count || 0,
    hasReadme: !!readmeFile,
    readmeContent,
    hasTests,
    hasCI,
    hasLicense,
    licenseName,
    hasDocker,
    hasContributing,
    hasLinter,
    totalFiles: files.length,
    fileStructure: filePaths.slice(0, 75),
    languages,
    commits,
    contributors,
    lastUpdated: repoInfo.updated_at,
    createdAt: repoInfo.created_at,
    topics: repoInfo.topics || [],
    packageJson,
    tsConfig,
    htmlUrl: repoInfo.html_url,
    defaultBranch,
  };
}

export async function verifyGitHubToken(token: string): Promise<GitHubUser> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token.trim()}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid GitHub token. Please verify your token and try again.');
    }
    throw new Error(`GitHub token verification failed with status: ${res.status}`);
  }

  const data = await res.json();
  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
    htmlUrl: data.html_url,
    token: token.trim(),
  };
}

export async function fetchUserRepositories(token: string): Promise<GitHubRepoSummary[]> {
  const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token.trim()}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user repositories from GitHub.');
  }

  const repos = await res.json();
  return repos.map((r: any) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    private: r.private,
    htmlUrl: r.html_url,
    updatedAt: r.updated_at,
  }));
}
