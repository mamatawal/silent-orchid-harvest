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

# Q2 – Unread Announcements Listing

**API endpoint:**

```
GET /api/v1/announcements/unread?customer_id={id}
```

Returns all announcements that the given customer has **not** yet read, ordered newest-first.

**ORM implementation** (`AnnouncementController::unread`):

```php
$unread = Announcement::whereDoesntHave('readByCustomers', function ($query) use ($customerId) {
    $query->where('customer_id', $customerId);
})->latest()->get();
```

Eloquent's `whereDoesntHave` generates the following SQL (example for `customer_id = 1`):

```sql
SELECT *
FROM `announcements`
WHERE NOT EXISTS (
    SELECT *
    FROM `announcement_customer`
    WHERE `announcements`.`id` = `announcement_customer`.`announcement_id`
      AND `announcement_customer`.`customer_id` = 1
)
ORDER BY `created_at` DESC
```

**Frontend:** Open http://localhost:5173 — the home page shows the unread announcements list with a customer selector dropdown.

**Verify via API directly:**

```bash
# Unread announcements for customer #1
curl http://localhost:8000/api/v1/announcements/unread?customer_id=1

# Unread announcements for customer #2
curl http://localhost:8000/api/v1/announcements/unread?customer_id=2
```

---

# Development Status

| Question | Status |
|----------|--------|
| Q4 | ✅ Environment setup and project structure |
| Q1 | ✅ Migrations, models, and seeded data |
| Q2 | ✅ Unread announcements listing (ORM + frontend) |
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

PR3 – Unread announcements listing (Q2)

Approximately 30 minutes

Tasks included:
- `AnnouncementController` with `unread` endpoint using Eloquent `whereDoesntHave`
- `customers` endpoint for the frontend customer selector
- API routes registered in `api.php`
- TypeScript interfaces for `Announcement` and `Customer`
- `UnreadAnnouncements` React page with customer selector dropdown
- README documentation including the ORM-generated SQL query
