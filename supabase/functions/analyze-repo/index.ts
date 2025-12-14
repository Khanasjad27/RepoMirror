import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubFile {
  name: string;
  path: string;
  type: string;
  size?: number;
}

interface RepoData {
  name: string;
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
  totalFiles: number;
  fileStructure: string[];
  languages: Record<string, number>;
  commits: number;
  contributors: number;
  lastUpdated: string;
  topics: string[];
  packageJson: any | null;
  tsConfig: any | null;
}

async function fetchGitHubData(owner: string, repo: string): Promise<RepoData> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoMirror-Analyzer',
  };

  // Fetch repo info
  console.log(`Fetching GitHub repo: https://api.github.com/repos/${owner}/${repo}`);
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  
  if (!repoRes.ok) {
    const status = repoRes.status;
    const rateLimitRemaining = repoRes.headers.get('X-RateLimit-Remaining');
    console.error(`GitHub API error: status=${status}, rateLimit=${rateLimitRemaining}`);
    
    if (status === 404) {
      throw new Error(`Repository not found. Please check that "${owner}/${repo}" exists and is public.`);
    } else if (status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    } else {
      throw new Error(`GitHub API error (status ${status}). Please try again.`);
    }
  }
  const repoInfo = await repoRes.json();

  // Fetch file tree
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
  const treeData = treeRes.ok ? await treeRes.json() : { tree: [] };
  const files: GitHubFile[] = treeData.tree || [];
  
  const fileNames = files.slice(0, 200).map((f: GitHubFile) => f.path);
  
  // Check for specific files
  const hasTests = files.some((f: GitHubFile) => 
    f.path.includes('test') || 
    f.path.includes('spec') || 
    f.path.includes('__tests__') ||
    f.path.endsWith('.test.ts') ||
    f.path.endsWith('.test.js') ||
    f.path.endsWith('.spec.ts') ||
    f.path.endsWith('.spec.js')
  );
  
  const hasCI = files.some((f: GitHubFile) => 
    f.path.includes('.github/workflows') || 
    f.path.includes('.travis.yml') ||
    f.path.includes('.circleci') ||
    f.path.includes('Jenkinsfile')
  );
  
  const hasLicense = files.some((f: GitHubFile) => 
    f.path.toLowerCase().includes('license')
  );

  // Fetch README
  let readmeContent = '';
  const readmeFile = files.find((f: GitHubFile) => f.path.toLowerCase() === 'readme.md');
  if (readmeFile) {
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, { headers });
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        readmeContent = atob(readmeData.content);
        // Truncate if too long
        if (readmeContent.length > 4000) {
          readmeContent = readmeContent.substring(0, 4000) + '\n... [truncated]';
        }
      }
    } catch (e) {
      console.log('Could not fetch README:', e);
    }
  }

  // Fetch languages
  const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
  const languages = langRes.ok ? await langRes.json() : {};

  // Fetch commits count
  const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
  let commits = 0;
  if (commitsRes.ok) {
    const linkHeader = commitsRes.headers.get('Link');
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      commits = match ? parseInt(match[1]) : 1;
    } else {
      commits = 1;
    }
  }

  // Fetch contributors count
  const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`, { headers });
  let contributors = 0;
  if (contribRes.ok) {
    const linkHeader = contribRes.headers.get('Link');
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      contributors = match ? parseInt(match[1]) : 1;
    } else {
      contributors = 1;
    }
  }

  // Try to fetch package.json
  let packageJson = null;
  if (files.some((f: GitHubFile) => f.path === 'package.json')) {
    try {
      const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        packageJson = JSON.parse(atob(pkgData.content));
      }
    } catch (e) {
      console.log('Could not parse package.json:', e);
    }
  }

  // Try to fetch tsconfig
  let tsConfig = null;
  if (files.some((f: GitHubFile) => f.path === 'tsconfig.json')) {
    try {
      const tsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tsconfig.json`, { headers });
      if (tsRes.ok) {
        const tsData = await tsRes.json();
        tsConfig = JSON.parse(atob(tsData.content));
      }
    } catch (e) {
      console.log('Could not parse tsconfig:', e);
    }
  }

  return {
    name: repoInfo.name,
    description: repoInfo.description,
    language: repoInfo.language,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count,
    openIssues: repoInfo.open_issues_count,
    hasReadme: !!readmeFile,
    readmeContent,
    hasTests,
    hasCI,
    hasLicense,
    totalFiles: files.length,
    fileStructure: fileNames,
    languages,
    commits,
    contributors,
    lastUpdated: repoInfo.updated_at,
    topics: repoInfo.topics || [],
    packageJson,
    tsConfig,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl } = await req.json();
    console.log('Analyzing repository:', repoUrl);

    // Parse GitHub URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!urlMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid GitHub URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [, owner, repo] = urlMatch;
    const repoName = repo.replace('.git', '');

    console.log(`Fetching data for: ${owner}/${repoName}`);

    // Fetch all GitHub data
    const repoData = await fetchGitHubData(owner, repoName);
    console.log('Repository data fetched:', {
      name: repoData.name,
      files: repoData.totalFiles,
      commits: repoData.commits,
      hasTests: repoData.hasTests,
      hasCI: repoData.hasCI
    });

    // Build the analysis prompt
    const analysisPrompt = `You are an expert software engineer with 10+ years of experience reviewing GitHub repositories. Analyze this repository data and provide an honest, accurate evaluation.

REPOSITORY DATA:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Primary Language: ${repoData.language || 'Unknown'}
- Stars: ${repoData.stars}
- Forks: ${repoData.forks}
- Open Issues: ${repoData.openIssues}
- Total Files: ${repoData.totalFiles}
- Commits: ${repoData.commits}
- Contributors: ${repoData.contributors}
- Last Updated: ${repoData.lastUpdated}
- Topics: ${repoData.topics.join(', ') || 'None'}

DOCUMENTATION:
- Has README: ${repoData.hasReadme ? 'Yes' : 'No'}
- README Content Preview:
${repoData.readmeContent || 'No README found'}

QUALITY INDICATORS:
- Has Tests: ${repoData.hasTests ? 'Yes' : 'No'}
- Has CI/CD: ${repoData.hasCI ? 'Yes' : 'No'}
- Has License: ${repoData.hasLicense ? 'Yes' : 'No'}

LANGUAGES USED:
${Object.entries(repoData.languages).map(([lang, bytes]) => `- ${lang}: ${bytes} bytes`).join('\n') || 'Unknown'}

FILE STRUCTURE (first 50 files):
${repoData.fileStructure.slice(0, 50).join('\n')}

PACKAGE.JSON (if available):
${repoData.packageJson ? JSON.stringify({
  name: repoData.packageJson.name,
  scripts: Object.keys(repoData.packageJson.scripts || {}),
  dependencies: Object.keys(repoData.packageJson.dependencies || {}).length + ' dependencies',
  devDependencies: Object.keys(repoData.packageJson.devDependencies || {}).length + ' dev dependencies',
}, null, 2) : 'Not found'}

TSCONFIG (if available):
${repoData.tsConfig ? JSON.stringify({
  strict: repoData.tsConfig.compilerOptions?.strict,
  target: repoData.tsConfig.compilerOptions?.target,
}, null, 2) : 'Not found'}

SCORING GUIDELINES:
- 90-100: Production-ready, excellent documentation, comprehensive tests, CI/CD, clean architecture
- 80-89: Very good quality, good docs, some tests, professional structure
- 70-79: Decent project, basic documentation, some quality indicators present
- 60-69: Functional but missing several best practices
- 50-59: Basic project, minimal documentation, no tests
- 40-49: Incomplete, poor structure, needs significant work
- Below 40: Very early stage or abandoned project

Be HONEST and STRICT in scoring. Student projects without tests, CI, or proper documentation should NOT score above 60-65.

Respond with ONLY valid JSON in this exact format:
{
  "score": <number 0-100>,
  "summary": "<concise 6-8 line summary highlighting key strengths and weaknesses>",
  "metrics": {
    "codeQuality": <number 0-100>,
    "documentation": <number 0-100>,
    "testing": <number 0-100>,
    "structure": <number 0-100>
  },
  "roadmap": [
    {
      "title": "<actionable step title>",
      "description": "<specific explanation of what to improve and why>",
      "priority": "high|medium|low"
    }
  ]
}

Provide 5-7 roadmap items ordered by priority. Be specific and actionable.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling AI for analysis...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    console.log('AI response received');

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse analysis results');
    }

    console.log('Analysis complete:', { score: analysis.score });

    return new Response(
      JSON.stringify({
        success: true,
        repoName: `${owner}/${repoName}`,
        ...analysis,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in analyze-repo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
