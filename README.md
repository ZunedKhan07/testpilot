# 🚀 TestPilot AI — Autonomous AI QA & Code Analysis Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green?logo=node.js)
![AI](https://img.shields.io/badge/AI-Gemini-orange?logo=google)

**TestPilot AI** is an AI-powered developer platform that helps developers analyze repositories, detect potential issues, understand code changes, and safely apply verified fixes.

TestPilot combines a web-based repository analysis dashboard with a CLI that developers can initialize directly inside their projects.

The platform follows a **Suggest → Review → Approve → Apply → Verify** workflow instead of blindly modifying source code.

---

## 🌟 Key Features

### 🔍 Repository Analysis

Analyze a GitHub repository and generate prioritized issues and improvement suggestions.

Issues are categorized as:

- 🔴 **Important** — Should be addressed
- 🟡 **Recommended** — Improves reliability or maintainability
- ⚪ **Optional** — Nice-to-have improvements

TestPilot does not send an entire large repository to the AI at once. It first analyzes the repository structure and builds relevant context before requesting AI analysis.

### 🧠 AI-Powered Code Analysis

Uses the user's own Gemini API key to analyze relevant source code and provide:

- Bug detection
- Code quality improvements
- Performance suggestions
- Security-related observations
- Missing test coverage
- Maintainability recommendations

### 💻 Developer CLI

TestPilot can be initialized directly inside a project:

    testpilot init

The CLI can inspect the local Git workspace and analyze relevant code changes.

### 🔄 Change-Aware Analysis

TestPilot detects changes in a Git repository and focuses analysis on affected files and relevant tests instead of repeatedly analyzing the entire project.

    Code Change
        ↓
    Git Diff
        ↓
    Affected Files
        ↓
    Relevant Tests
        ↓
    AI Analysis
        ↓
    Result

### 🛡️ Safe AI Fixes

TestPilot does not blindly modify source code.

The workflow is:

    Issue Detected
          ↓
    AI Suggestion
          ↓
    Show Diff
          ↓
    User Approval
          ↓
    Apply Change
          ↓
    Run Tests
          ↓
    Verify Result

If verification fails, the change can be rejected or reverted instead of silently leaving broken code.

### 🔑 User-Owned AI API Key

TestPilot is designed around a **user-provided AI API key**.

This allows users to control their own AI usage and API costs.

The API key should be handled securely and should never be exposed through logs, source control, or client-side public code.

---

# 🏗️ Architecture

    TestPilot AI
          │
          ├───────────────┐
          │               │
    Web Dashboard        CLI
          │               │
          └───────┬───────┘
                  │
             Backend API
                  │
          ┌───────┴────────┐
          │                │
    Repository Scanner   Git / GitHub
          │                │
          └───────┬────────┘
                  │
           Context Builder
                  │
            User's AI API
                  │
        Analysis / Suggestion
                  │
           User Approval
                  │
           Apply Changes
                  │
        Tests & Verification
                  │
              Git / PR

---

# 📁 Project Structure

    testpilot/
    │
    ├── server/                    # Backend API and core services
    │   ├── src/
    │   │   ├── config/
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   └── app.ts
    │   │
    │   └── package.json
    │
    ├── client/                    # React web dashboard
    │   ├── src/
    │   ├── public/
    │   ├── index.html
    │   └── package.json
    │
    ├── cli/                       # TestPilot CLI
    │   ├── src/
    │   │   ├── bin/
    │   │   └── commands/
    │   └── package.json
    │
    └── README.md

---

# ⚙️ Tech Stack

## Backend

- **Node.js** — Server runtime
- **TypeScript** — Type-safe development
- **Express.js** — REST API server
- **MongoDB** — Application data storage
- **Mongoose** — MongoDB object modeling
- **dotenv** — Environment configuration
- **CORS** — Frontend/backend communication

## Frontend

- **React** — Web dashboard
- **TypeScript** — Type-safe frontend development
- **Vite** — Development and build tooling
- **Tailwind CSS** — UI styling

## AI & Agent

- **Strands Agents SDK** — Agent orchestration
- **Google Gemini API** — AI reasoning and code analysis
- **User-provided API key** — User-controlled AI usage and cost

## Repository Intelligence

- **Git** — Change and diff detection
- **GitHub API** — Repository and pull request integration
- **Node.js File System APIs** — Local repository inspection
- **TypeScript/JavaScript parsers** — Code structure analysis
- **Context Builder** — Selects relevant code before AI analysis

## Testing

- **Playwright** — Browser and E2E testing
- **Playwright Test** — Test execution and verification

## CLI

- **Node.js + TypeScript**
- **Commander.js** — CLI command handling
- **@clack/prompts** — Interactive terminal prompts
- **picocolors** — Terminal output formatting
- **simple-git** — Git operations
- **tsup** — CLI bundling

## CI/CD

- **GitHub Actions** — Automated workflows
- **GitHub Webhooks** — Repository change notifications

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Git
- MongoDB
- GitHub account
- Gemini API key

---

## 1. Clone the Repository

    git clone https://github.com/your-username/testpilot.git
    cd testpilot

---

## 2. Setup Backend

    cd server
    npm install

Create a `.env` file:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string

Start the development server:

    npm run dev

---

## 3. Setup Frontend

Open another terminal:

    cd client
    npm install
    npm run dev

---

## 4. Setup CLI

    cd cli
    npm install
    npm run build
    npm link

After linking, the CLI can be used globally:

    testpilot --help

---

# 💻 CLI Usage

Initialize TestPilot inside an existing project:

    testpilot init

Scan the current Git workspace:

    testpilot scan

The CLI detects the project structure and relevant Git changes before running analysis.

---

# 🔑 Gemini API Key

TestPilot is designed to use the developer's own AI API key.

### Windows PowerShell

    $env:GEMINI_API_KEY="your_gemini_api_key"

### Windows Command Prompt

    set GEMINI_API_KEY=your_gemini_api_key

### Linux / macOS

    export GEMINI_API_KEY="your_gemini_api_key"

**Never commit API keys to Git.**

Add environment files to `.gitignore`:

    .env
    .env.*
    !.env.example
    node_modules/
    dist/

---

# 🔒 Security Principles

TestPilot follows these principles:

- AI should not blindly modify source code.
- Changes require user approval before being applied.
- Generated changes should be verified using tests.
- API keys should never be committed to source control.
- API keys should not be exposed in logs.
- Large repositories should not be sent to AI as one massive request.
- Only relevant repository context should be provided to the AI whenever possible.

---

# 🔄 How TestPilot Works

## Repository Analysis

    GitHub Repository
           ↓
    Repository Scanner
           ↓
    Project Structure
           ↓
    Relevant Code & Tests
           ↓
    Context Builder
           ↓
       Gemini AI
           ↓
    Prioritized Report

## Change Monitoring

    Developer Changes Code
             ↓
          Git Diff
             ↓
        Changed Files
             ↓
     Affected Code / Tests
             ↓
      Playwright / Test Runner
             ↓
           Failure?
             ↓
       AI Investigation
             ↓
     Suggestion / Report

## Safe Fix Workflow

    Issue
      ↓
    AI Suggested Fix
      ↓
    Show Diff
      ↓
    User Approval
      ↓
    Apply
      ↓
    Run Tests
      ↓
    Verify
      ↓
    Commit / Pull Request

---

# 🛣️ Roadmap

- [ ] GitHub repository analysis
- [ ] Prioritized issue detection
- [ ] Change-aware code analysis
- [ ] Playwright integration
- [ ] AI failure diagnosis
- [ ] Safe AI-generated fixes
- [ ] Automated verification
- [ ] GitHub Pull Request integration
- [ ] GitHub Actions integration
- [ ] Repository health dashboard
- [ ] VS Code extension
- [ ] Multi-LLM provider support

---

# 🎯 Project Goal

TestPilot aims to reduce repetitive QA and debugging work by continuously understanding software changes and helping developers identify, investigate, and safely resolve problems.

The core principle is:

> **AI should assist developers, not blindly control their codebase.**

---

# 👨‍💻 Developer

**Juned Khan**

GitHub: https://github.com/ZunedKhan07

Portfolio: https://portf-o-jk.vercel.app

Email: zunedkhan107@gmail.com

---

# 📄 License

This project is licensed under the **MIT License**.