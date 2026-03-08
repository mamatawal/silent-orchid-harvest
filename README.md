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

# Q1 – Seeded Announcements & Customers

The seeder creates the following data automatically when the application first boots (or when you run it manually).

**What gets seeded:**
- 5 announcements (product updates, feature releases, bug fixes, etc.)
- 2 customers (Mohammad, Awaludin)
- Announcement #1 is marked as **read** by Customer #1 (Mohammad)

**To run the seeder manually** (after the containers are already up):

```bash
docker compose exec backend php artisan db:seed
```

**To verify the seeded data** directly in MySQL:

```bash
docker compose exec mysql mysql -u tyrell -psecret announcekit \
  -e "SELECT * FROM announcements; SELECT * FROM customers; SELECT * FROM announcement_customer;"
```

**To reset and re-seed from scratch:**

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

---

# Development Status

| Question | Status |
|----------|--------|
| Q4 | ✅ Environment setup and project structure |
| Q1 | ✅ Migrations, models, and seeded data |
| Q2 | 🔜 Unread announcements listing (ORM) |
| Q3 | 🔜 Mark announcement as read |

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

PR2 – Create announcements and customers with seeded data (Q1)

Approximately 30 minutes

Tasks included:
- Database migrations for `customers`, `announcements`, and `announcement_customer` pivot tables
- Eloquent models (`Customer`, `Announcement`) with `BelongsToMany` relationships
- `AnnouncementSeeder` to seed 5 announcements, 2 customers, and mark announcement #1 as read by customer #1
- README documentation for Q1
