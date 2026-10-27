import { RepoMetadata } from './github';

export interface RoadmapItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'Quick Win (< 1 hr)' | 'Medium (1-2 days)' | 'Major (1+ week)';
  category: 'Security' | 'Testing' | 'Architecture' | 'Documentation' | 'CI/CD' | 'Performance';
}

export interface AnalysisResult {
  score: number;
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  verdict: string;
  percentile: number;
  summary: string;
  keyStrengths: string[];
  criticalGaps: string[];
  metrics: {
    codeQuality: number;
    documentation: number;
    testing: number;
    structure: number;
  };
  metricDetails: {
    codeQualityReason: string;
    documentationReason: string;
    testingReason: string;
    structureReason: string;
  };
  roadmap: RoadmapItem[];
}

export function getStoredGeminiKey(): string {
  try {
    const local = localStorage.getItem('repomirror_gemini_api_key');
    if (local && local.trim()) return local.trim();
  } catch (e) {
    // ignore
  }
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  return envKey.trim();
}

export function saveStoredGeminiKey(key: string): void {
  try {
    if (!key.trim()) {
      localStorage.removeItem('repomirror_gemini_api_key');
    } else {
      localStorage.setItem('repomirror_gemini_api_key', key.trim());
    }
  } catch (e) {
    console.warn('Failed to save Gemini key to localStorage:', e);
  }
}

export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  const trimmed = apiKey.trim();
  if (!trimmed) return false;

  const testModels = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
  for (const model of testModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${trimmed}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }],
        }),
      });
      if (res.ok || res.status === 503) return true;
      if (res.status === 400 || res.status === 403) return false;
    } catch {
      // try next fallback
    }
  }
  return false;
}

function calculateGrade(score: number): {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  verdict: string;
  percentile: number;
} {
  if (score >= 95) return { grade: 'A+', verdict: 'Production Ready & Exemplary', percentile: 98 };
  if (score >= 88) return { grade: 'A', verdict: 'Industry Production Standard', percentile: 90 };
  if (score >= 80) return { grade: 'B+', verdict: 'Strong Foundation - Minor Gaps', percentile: 78 };
  if (score >= 70) return { grade: 'B', verdict: 'Good Potential - Missing Polish', percentile: 62 };
  if (score >= 60) return { grade: 'C+', verdict: 'Functional - Best Practices Needed', percentile: 45 };
  if (score >= 50) return { grade: 'C', verdict: 'Basic Prototype - Incomplete Docs/Tests', percentile: 30 };
  if (score >= 40) return { grade: 'D', verdict: 'Early Stage - Substantial Refactoring Required', percentile: 15 };
  return { grade: 'F', verdict: 'Incomplete or Stale Repository', percentile: 5 };
}

export async function analyzeRepositoryWithGemini(
  repo: RepoMetadata,
  apiKeyOverride?: string,
  onProgress?: (stage: string) => void
): Promise<AnalysisResult> {
  const key = apiKeyOverride || getStoredGeminiKey();
  if (!key) {
    throw new Error('MISSING_GEMINI_KEY');
  }

  onProgress?.('Synthesizing repository metrics for Gemini...');

  const topLanguages = Object.entries(repo.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, bytes]) => `${lang} (${Math.round(bytes / 1024)} KB)`)
    .join(', ') || repo.language || 'Unknown';

  const prompt = `You are a Principal Software Engineer & Staff Tech Lead reviewing candidate code repositories for production standards.
Analyze the provided GitHub repository data and produce an objective, strict, senior-grade technical evaluation.

CRITICAL REVIEW RULES:
1. Be STRICT and UNBIASED. Do NOT give inflated scores. 
2. If tests are absent (hasTests = false), "testing" metric MUST NOT exceed 25/100.
3. If CI/CD is absent (hasCI = false), overall score should be penalized appropriately.
4. If README is empty or minimal, "documentation" metric must not exceed 45/100.
5. Provide actionable, high-signal engineering advice that would genuinely impress hiring managers.

REPOSITORY DATA:
- Repository Name: ${repo.fullName}
- Primary Language: ${repo.language || 'Not detected'}
- All Languages: ${topLanguages}
- Description: ${repo.description || 'None provided'}
- Stars: ${repo.stars} | Forks: ${repo.forks} | Open Issues: ${repo.openIssues}
- Commits (approx): ${repo.commits} | Contributors: ${repo.contributors}
- Total Files: ${repo.totalFiles}
- Has Tests: ${repo.hasTests ? 'YES' : 'NO'}
- Has CI/CD Pipeline: ${repo.hasCI ? 'YES' : 'NO'}
- Has License: ${repo.hasLicense ? `YES (${repo.licenseName || 'Detected'})` : 'NO'}
- Has Docker / Containers: ${repo.hasDocker ? 'YES' : 'NO'}
- Has Linter / Formatting Config: ${repo.hasLinter ? 'YES' : 'NO'}
- Has Contributing Guidelines: ${repo.hasContributing ? 'YES' : 'NO'}
- Last Active Date: ${repo.lastUpdated}

FILE TREE SAMPLE (First 50 files):
${repo.fileStructure.slice(0, 50).join('\n')}

PACKAGE / DEPENDENCIES:
${repo.packageJson ? JSON.stringify({
  name: repo.packageJson.name,
  dependenciesCount: Object.keys(repo.packageJson.dependencies || {}).length,
  devDependenciesCount: Object.keys(repo.packageJson.devDependencies || {}).length,
  scripts: Object.keys(repo.packageJson.scripts || {}),
}, null, 2) : 'No package.json detected'}

README PREVIEW:
${repo.readmeContent ? repo.readmeContent.substring(0, 2000) : 'No README file present'}

OUTPUT SPECIFICATION:
You MUST respond with valid JSON strictly conforming to this structure:
{
  "score": <number 0-100>,
  "summary": "<4-6 sentences candid engineering review covering architecture, robustness, and hiring readiness>",
  "keyStrengths": [
    "<specific strong engineering point 1>",
    "<specific strong engineering point 2>",
    "<specific strong engineering point 3>"
  ],
  "criticalGaps": [
    "<specific gap or vulnerability 1>",
    "<specific gap or vulnerability 2>",
    "<specific gap or vulnerability 3>"
  ],
  "metrics": {
    "codeQuality": <number 0-100>,
    "documentation": <number 0-100>,
    "testing": <number 0-100>,
    "structure": <number 0-100>
  },
  "metricDetails": {
    "codeQualityReason": "<1 sentence justifying the code quality score>",
    "documentationReason": "<1 sentence justifying the documentation score>",
    "testingReason": "<1 sentence justifying the testing score>",
    "structureReason": "<1 sentence justifying the structure score>"
  },
  "roadmap": [
    {
      "title": "<Concise Action Title>",
      "description": "<Detailed concrete instructions on how and why to implement this step>",
      "priority": "high" | "medium" | "low",
      "effort": "Quick Win (< 1 hr)" | "Medium (1-2 days)" | "Major (1+ week)",
      "category": "Security" | "Testing" | "Architecture" | "Documentation" | "CI/CD" | "Performance"
    }
  ]
}

Provide 5 to 7 prioritized roadmap items ordered by priority (high first). Respond ONLY with valid JSON.`;

  onProgress?.('Consulting Gemini AI intelligence...');

  // Modern supported Gemini models in sequence with graceful fallback
  const models = [
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`Gemini model ${model} returned error status ${res.status}:`, errorText);
        if (res.status === 400 && errorText.includes('API_KEY_INVALID')) {
          throw new Error('Invalid Gemini API Key. Please verify your key in Settings.');
        }
        if (res.status === 429) {
          throw new Error('Gemini API rate limit reached. Please wait a moment and try again.');
        }
        continue; // try next model
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        continue;
      }

      // Parse JSON safely
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) continue;

      const parsed = JSON.parse(match[0]);
      const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 60)));
      const gradeInfo = calculateGrade(score);

      return {
        score,
        letterGrade: gradeInfo.grade,
        verdict: gradeInfo.verdict,
        percentile: gradeInfo.percentile,
        summary: parsed.summary || 'Repository analysis completed.',
        keyStrengths: Array.isArray(parsed.keyStrengths) && parsed.keyStrengths.length > 0
          ? parsed.keyStrengths
          : ['Clean project naming and repository organization'],
        criticalGaps: Array.isArray(parsed.criticalGaps) && parsed.criticalGaps.length > 0
          ? parsed.criticalGaps
          : ['Missing comprehensive automated testing coverage'],
        metrics: {
          codeQuality: Math.round(Number(parsed.metrics?.codeQuality) || score),
          documentation: Math.round(Number(parsed.metrics?.documentation) || (repo.hasReadme ? 70 : 30)),
          testing: Math.round(Number(parsed.metrics?.testing) || (repo.hasTests ? 70 : 15)),
          structure: Math.round(Number(parsed.metrics?.structure) || score),
        },
        metricDetails: {
          codeQualityReason: parsed.metricDetails?.codeQualityReason || 'Evaluated based on code cleanliness and structure.',
          documentationReason: parsed.metricDetails?.documentationReason || (repo.hasReadme ? 'README is present with overview.' : 'Missing documentation.'),
          testingReason: parsed.metricDetails?.testingReason || (repo.hasTests ? 'Test suites detected.' : 'No automated test files found.'),
          structureReason: parsed.metricDetails?.structureReason || 'Repository folder hierarchy evaluated.',
        },
        roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : [],
      };
    } catch (e: any) {
      lastError = e;
      if (e.message?.includes('Invalid Gemini API Key') || e.message?.includes('rate limit')) {
        throw e;
      }
    }
  }

  throw lastError || new Error('Failed to obtain analysis from Gemini AI. Please verify your API Key.');
}
