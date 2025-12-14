import { Search, BarChart3, Map, Zap, Shield, GitBranch, FileCode, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Paste Your Repo URL",
    description: "Simply paste your public GitHub repository URL into the analyzer.",
    icon: GitBranch,
  },
  {
    step: "02",
    title: "AI Analyzes Your Code",
    description: "Our AI examines your code structure, documentation, tests, and best practices.",
    icon: Search,
  },
  {
    step: "03",
    title: "Get Detailed Report",
    description: "Receive an honest score with actionable insights to improve your repository.",
    icon: BarChart3,
  },
];

const features = [
  {
    title: "Real Code Analysis",
    description: "We fetch and analyze your actual repository data - file structure, commits, tests, CI/CD, and more.",
    icon: FileCode,
  },
  {
    title: "Honest Scoring",
    description: "No inflated grades. Get realistic scores based on industry standards that HR and recruiters trust.",
    icon: Shield,
  },
  {
    title: "Personalized Roadmap",
    description: "Priority-ordered improvement steps tailored specifically to your repository's weaknesses.",
    icon: Map,
  },
  {
    title: "Fast Results",
    description: "Get comprehensive analysis in seconds, not hours. Perfect for quick portfolio reviews.",
    icon: Zap,
  },
];

const faqs = [
  {
    question: "What repositories can I analyze?",
    answer: "You can analyze any public GitHub repository. Private repositories require GitHub authentication (coming soon).",
  },
  {
    question: "How accurate is the scoring?",
    answer: "Our AI uses industry-standard metrics: code quality, documentation, test coverage, CI/CD presence, commit history, and more. Scores are calibrated to match what senior engineers and recruiters expect.",
  },
  {
    question: "Can I share the report with HR?",
    answer: "Yes! The analysis is designed to be professional and shareable. You can screenshot or describe the results in your applications.",
  },
  {
    question: "Why is my score lower than expected?",
    answer: "We use strict, honest scoring. Projects without tests, CI/CD, or comprehensive documentation typically score 40-65. This reflects real-world expectations from employers.",
  },
];

export function LandingSections() {
  return (
    <>
      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get honest feedback on your code
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative p-8 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="text-6xl font-bold text-primary/10 absolute top-4 right-4">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose RepoMirror?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by engineers who review code for a living
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 flex gap-5"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-card/50 border border-border/50"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground text-sm pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
