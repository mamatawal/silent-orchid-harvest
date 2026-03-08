# AnnounceKit Simplified – Tyrell Systems Technical Assessment

This project implements a simplified version of the AnnounceKit announcement system.

The goal of this assessment is to build a system where customers can view announcements and track which announcements have been read.

---

# Tech Stack

Backend
- PHP
- Laravel

Frontend
- React
- TypeScript
- TailwindCSS

Database
- MySQL

Environment
- Docker

---

# Project Structure

```
.
├── docker-compose.yml          # Orchestrates all three services
├── backend/                    # Laravel 11 application
│   ├── Dockerfile
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
└── frontend/                   # React 18 + TypeScript + Vite + Tailwind
    ├── Dockerfile
    ├── src/
    │   ├── api/client.ts
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── pages/
    │   ├── types/index.ts
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---

# Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Docker | 24+ |
| Docker Compose | v2 (bundled with Docker Desktop) |
| Git | any recent version |

No local PHP, Node.js, or MySQL installation is required – everything runs inside Docker containers.

---

# Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/mamatawal/silent-orchid-harvest.git
cd silent-orchid-harvest

# 2. Start all services (MySQL → backend → frontend)
docker compose up --build
```

On first boot the backend container will automatically:
1. Run `composer install`
2. Generate an `APP_KEY`
3. Run all database migrations
4. Run the database seeder

| Service | URL |
|---------|-----|
| React frontend | http://localhost:5173 |
| Laravel API | http://localhost:8000/api/v1 |

To stop all services:

```bash
docker compose down
```

To rebuild from scratch (e.g. after changing environment variables):

```bash
docker compose down -v   # removes named volumes including MySQL data
docker compose up --build
```

---

# Development Status

This PR sets up the project structure and development environment.

Upcoming implementation:

Q1
Create announcements and customers with seeded data.

Q2
Implement unread announcements listing using ORM.

Q3
Implement mechanism to mark announcements as read.

---

### Environment variables

All environment variables for the backend are managed inside `docker-compose.yml` and are pre-configured. No manual `.env` editing is needed for local development.

| Variable | Default |
|----------|---------|
| `DB_HOST` | `mysql` |
| `DB_DATABASE` | `announcekit` |
| `DB_USERNAME` | `tyrell` |
| `DB_PASSWORD` | `secret` |
| `VITE_API_URL` | `http://localhost:8000` |

---

### AI Usage Disclosure

AI tools were used during this assessment as follows:

| Tool | Usage |
|------|-------|
| **ChatGPT** | Used for implementation brainstorming, scaffolding assistance, documentation drafting, code refinement suggestions |

All final code, project structure decisions, ORM implementation, validation flow, and documentation were reviewed and verified manually before submission.

---

### Time Spent

PR1 – Setup development environment and project structure

Approximately 45 minutes

Tasks included:
- Project initialization
- Docker environment setup
- Laravel and React project structure
- Initial README documentation
