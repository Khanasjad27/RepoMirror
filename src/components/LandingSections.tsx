import {
  Search,
  BarChart3,
  Map,
  Zap,
  Shield,
  GitBranch,
  FileCode,
  CheckCircle,
  Cpu,
  TestTube2,
  Terminal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    step: '01',
    title: 'Submit Repository',
    description: 'Paste any public GitHub repository URL or select one of your repositories from your authenticated profile.',
    icon: GitBranch,
  },
  {
    step: '02',
    title: 'Multi-Vector AST Scan',
    description: 'We inspect file trees, test suites, CI/CD workflows, dependency manifests, and documentation quality.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Gemini Technical Audit',
    description: 'Google Gemini analyzes code hygiene against senior engineering standards to generate an honest review and roadmap.',
    icon: Cpu,
  },
];

const criteria = [
  {
    title: 'Automated Testing & Reliability',
    weight: '30%',
    desc: 'Presence of unit tests, integration suites (Jest, Vitest, PyTest, Go test), test coverage, and mocking hygiene.',
    icon: TestTube2,
  },
  {
    title: 'Architecture & Project Structure',
    weight: '25%',
    desc: 'Separation of concerns, clean directory modularity, configuration isolation, and file naming discipline.',
    icon: FileCode,
  },
  {
    title: 'Documentation & Onboarding',
    weight: '25%',
    desc: 'Clear README with architecture diagrams, setup instructions, environment variable guides, and API examples.',
    icon: BarChart3,
  },
  {
    title: 'DevOps & CI/CD Pipelines',
    weight: '20%',
    desc: 'Automated GitHub Actions workflows, linting (ESLint, Prettier, Biome), Dockerfiles, and branch protection.',
    icon: ShieldCheck,
  },
];

const features = [
  {
    title: '100% Client-Side Engine',
    description: 'Direct browser-to-GitHub and browser-to-Gemini execution. No cloud server bottlenecks or data tracking.',
    icon: Zap,
  },
  {
    title: 'Calibrated Hiring Standards',
    description: 'No inflated grades. Evaluated strictly against what senior engineers and hiring tech leads look for.',
    icon: Shield,
  },
  {
    title: 'Actionable Prioritized Roadmap',
    description: 'Clear, time-estimated action items so you know exactly which improvements yield the highest impact.',
    icon: Map,
  },
  {
    title: 'One-Click Markdown Reports',
    description: 'Export audits directly formatted for GitHub PRs, job applications, portfolio showcases, or resumes.',
    icon: Terminal,
  },
];

const faqs = [
  {
    question: 'How does RepoMirror score repositories?',
    answer:
      'RepoMirror conducts a real-time scan of your repository via GitHub REST APIs (file tree, README, test suites, workflows, dependencies) and prompts Google Gemini with strict hiring-rubric guidelines. Scores reflect realistic production expectations.',
  },
  {
    question: 'Why do I need a Gemini API key?',
    answer:
      'By bringing your own free Google Gemini API key (from Google AI Studio), you can run unlimited analyses directly in your browser without hitting third-party cloud caps. The key stays 100% inside your local browser storage.',
  },
  {
    question: 'What does "Sign in with GitHub" do?',
    answer:
      'GitHub restricts unauthenticated API calls to 60/hr. Signing in with a GitHub Personal Access Token increases your limit to 5,000/hr and allows you to select your own repositories from a dropdown menu with 1 click.',
  },
  {
    question: 'Can I share the audit with recruiters or on LinkedIn?',
    answer:
      'Absolutely! Click "Copy Markdown" to get a clean, professional summary of your scores, strengths, and architecture roadmap ready to include in your PRs or portfolio.',
  },
];

export function LandingSections() {
  return (
    <div className="space-y-24 py-12">
      {/* How It Works */}
      <section id="how-it-works" className="px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How RepoMirror Evaluates Code
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Three streamlined phases connecting raw GitHub metadata with Google Gemini AI intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-7 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/40 transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="text-6xl font-black text-secondary/70 absolute top-4 right-4 select-none font-mono">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform text-primary">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Rubrics */}
      <section id="evaluation-criteria" className="px-4 py-12 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              Hiring Rubric
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Strict Evaluation Criteria
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Weighted scoring standards mirroring real-world senior software engineer and recruiter reviews.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {criteria.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card/60 border border-border/80 flex items-start gap-4 hover:border-primary/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">{item.title}</h3>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Weight: {item.weight}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Engineered for Developers
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Everything you need to turn side projects into production-grade repositories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/40 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Questions
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card/50 border border-border/80 space-y-2 hover:border-primary/30 transition-all"
              >
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground pl-8 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
