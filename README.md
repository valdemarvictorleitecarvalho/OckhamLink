<div align="center">
  <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" alt="OckhamLink Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  <h1>OckhamLink</h1>
  
  <p><strong>Shave the excess. Simplify the truth.</strong></p>
  <p>A lightning-fast, highly reliable URL shortener and resolver.</p>

  <p>
    <a href="https://github.com/valdemarvictorleitecarvalho/OckhamLink/actions"><img src="https://img.shields.io/github/actions/workflow/status/valdemarvictorleitecarvalho/OckhamLink/ci.yml?branch=main&style=for-the-badge&logo=github" alt="CI Status"></a>
    <a href="https://sonarcloud.io/summary/new_code?id=valdemarvictorleitecarvalho_OckhamLink"><img src="https://img.shields.io/sonar/coverage/valdemarvictorleitecarvalho_OckhamLink?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge&logo=sonarcloud" alt="Coverage"></a>
    <a href="https://sonarcloud.io/summary/new_code?id=valdemarvictorleitecarvalho_OckhamLink"><img src="https://img.shields.io/sonar/quality_gate/valdemarvictorleitecarvalho_OckhamLink?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge" alt="Quality Gate"></a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## 📖 Overview

OckhamLink is a dual-purpose URL management platform. It allows users to instantly shave off excess characters from long URLs to create compact, elegant links with auto-generated QR Codes. Conversely, it acts as a security tool, allowing users to safely resolve and inspect unknown short links before clicking them.

Engineered as a full-stack monorepo, the application guarantees extreme performance and zero collisions using an atomic Redis counter combined with Sqids, while the frontend provides a seamless, dynamically animated dual-pane interface powered by React and TanStack Query.

## 🚀 Tech Stack

**Frontend**
- **Core**: React, TypeScript, Vite
- **Data Fetching**: TanStack Query (React Query), Axios
- **Testing**: Vitest, React Testing Library
- **Styling**: CSS3 

**Backend**
- **Core**: NestJS, TypeScript
- **Database/Cache**: Redis (ioredis)
- **ID Generation**: Sqids (Collision-free, YouTube-like IDs)
- **Testing**: Jest, Supertest

**DevOps & Infra**
- **Code Quality**: SonarCloud, ESLint, Prettier
- **Git Hooks**: Husky (Pre-push verification)
- **Containerization**: Docker & Docker Compose 

---

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [npm](https://docs.npmjs.com/)
- [Docker](https://docs.docker.com/engine/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/en/download)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/OckhamLink.git
cd 

# Install dependencies strictly using npm
npm install
```

### 2. Spin up the Infrastructure

Start the local Back, Front & Redis instances in the background:
```bash
docker-compose up -d
```

### 3. Run the Application

Now frontend is running at localhost:5173/ and backend is running at localhost:3000/

**API Documentation:** Once the server is running, access the interactive Swagger UI at http://localhost:3000/api (or your configured port).

## 🏗️ Architecture & Project Structure

This project is structured as a monorepo, housing both the frontend client and the backend API, sharing the same repository for unified CI/CD and versioning.
```bash
OckhamLink/
├── frontend/           # React & Vite application (UI, TanStack Query, Vitest)
├── backend/            # NestJS API (Shortener Logic, Redis integration, Jest)
├── .github/workflows/  # CI/CD pipelines (SonarCloud analysis, Build verification)
└── package.json        # Root configurations and Husky pre-push hooks
```

## 🧪 Testing Strategy

We embrace "Shift-Left" quality mindset. To run tests locally:
```bash
# Run all tests and generate coverage reports for both sides
npm run test:cov --prefix backend
npm run test:cov --prefix frontend
```

**Husky & CI/CD**

This project uses Husky to enforce quality. Before every git commit, a script automatically runs lint-staged and commitlint. Before every git push, a script automatically builds the application and runs the entire test suite. If tests fail, or the build breaks, the push is aborted.

## 🤝 Contributing

We follow a structured workflow to maintain the integrity of the monorepo:

- **Branching**: Create a branch from main.
- **Commits**: We use Conventional Commits. Husky will also lint your commit messages.
- **Pre-commit Hooks**: Code formatting and Linting will run automatically upon committing.
- **Pull Requests**: Open a PR against the main branch. The GitHub Actions CI will perform a SonarCloud scan. PRs will only be merged if the Quality Gate passes.
- **Merge Strategy**: All PRs must be merged using Squash and Merge to maintain a linear history.

**Documentation Rules**

- **Swagger (@Api...)**: Strictly reserved for the infrastructure/http backend layer.
- **TSDoc (/// or /** */)**: Used in all the project to provide context for complex business rules and relationships.
