# RepoMirror 🔍
### Senior Staff Code Review & Repository Intelligence

RepoMirror is a modern developer tool that evaluates GitHub repositories against senior software engineer and recruiter-level hiring standards. It acts as a **Repository Mirror**, providing candid technical evaluations, architectural audits, and actionable roadmaps to elevate projects into production-ready repositories.

---

## 🔗 Live Application
[https://repo-mirror-asjad-khan.vercel.app](https://repo-mirror-asjad-khan.vercel.app)

## 📌 Repository
[https://github.com/Khanasjad27/RepoMirror](https://github.com/Khanasjad27/RepoMirror)

---

## ✨ Features & Upgrades
- **100% Standalone & Client-Side Engine:** Decoupled from third-party cloud services like Supabase and Lovable. Communicates directly with GitHub and Google Gemini REST APIs.
- **Custom Google Gemini API Key:** Run unlimited analyses by adding your own Gemini API key in the UI settings or via environment variables.
- **GitHub Authentication & Rate Limit Expansion:** Connect via GitHub Personal Access Token or 1-Click Demo Profile to unlock 5,000 GitHub requests/hour and browse your own repositories.
- **Senior Staff 4-Pillar Evaluation:**
  - 🧪 **Automated Testing & Reliability** (30%)
  - 🏗️ **Architecture & Modularity** (25%)
  - 📖 **Documentation & Onboarding** (25%)
  - 🚀 **DevOps & CI/CD Pipelines** (20%)
- **Actionable Prioritized Roadmap:** Time-estimated remediation steps (Quick Win, Medium, Major) categorized by Security, Testing, Architecture, and CI/CD with completion toggles and copyable prompts.
- **Export & Share:** Export full Markdown reports for GitHub PRs, download JSON audits, or share results directly.

---

## 🛠 Tech Stack
- **Framework:** React 18, Vite, TypeScript
- **Styling & UI:** Tailwind CSS, Radix UI Primitives, Lucide Icons
- **AI Intelligence:** Google Gemini API (`gemini-2.5-flash`, `gemini-1.5-flash`)
- **APIs:** GitHub REST API v3
- **Deployment:** Vercel

---

## 🔐 Environment Variables

You can configure optional default environment variables in `.env` (or in Vercel Project Settings):

```bash
# Google Gemini API Key (Get a free key from https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY="your-gemini-api-key"

# Optional: GitHub Personal Access Token (for 5,000 req/hr default rate limit)
VITE_GITHUB_TOKEN=""
```

> **Note:** If no key is set in the environment, users can easily enter their own Gemini API key directly through the in-app modal. Keys are saved securely in the user's browser `localStorage` and never sent to external servers.

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Khanasjad27/RepoMirror.git
   cd RepoMirror
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👤 Author
**Asjad Khan**  
GitHub: [@Khanasjad27](https://github.com/Khanasjad27)
