# AnnounceKit Simplified – Tyrell Systems Technical Assessment

A simplified version of the AnnounceKit platform: a list of unread announcements per customer.

**Stack:** Laravel 11 (PHP 8.3) · React 18 + TypeScript · Tailwind CSS · MySQL 8.4 · Docker

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Q1 – Seeded Data](#q1--seeded-data)
4. [Q2 – Unread Announcements (ORM Query)](#q2--unread-announcements-orm-query)
5. [Q3 – Mark Announcement as Read](#q3--mark-announcement-as-read)
6. [Q4 – Environment & Project Setup](#q4--environment--project-setup)
7. [API Reference](#api-reference)
8. [AI Usage Disclosure](#ai-usage-disclosure)
9. [Time Spent](#time-spent)

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Docker | 24+ |
| Docker Compose | v2 (bundled with Docker Desktop) |
| Git | any recent version |

No local PHP, Node.js, or MySQL installation is required – everything runs inside Docker containers.

---

## Quick Start

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
4. Run the database seeder (creates 5 announcements, 2 customers, and marks announcement #1 as read by customer #1)

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

## Q1 – Seeded Data

The seeder (`database/seeders/AnnouncementSeeder.php`) runs automatically on every boot and is idempotent (safe to run multiple times):

| # | Action |
|---|--------|
| 1 | Creates **5 announcements** (Welcome to AnnounceKit, New Dashboard Released, Performance Improvements, Bug Fix: Notification Delays, Upcoming Maintenance Window) |
| 2 | Creates **2 customers**: Mohammad (ID 1) and Awaludin (ID 2) |
| 3 | Marks **announcement #1** as read by **customer #1** (Mohammad) via the `announcement_customer` pivot table |

To re-run the seeder manually (resets the DB first):

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

To verify seeded data directly:

```bash
docker compose exec mysql mysql -u tyrell -psecret announcekit \
  -e "SELECT * FROM announcements; SELECT * FROM customers; SELECT * FROM announcement_customer;"
```

---

## Q2 – Unread Announcements (ORM Query)

### How to use the UI

1. Open http://localhost:5173 in Chrome.
2. The **Unread Announcements** page loads automatically.
3. Use the **customer dropdown** to pick a customer.
4. The page instantly shows all announcements that customer has **not yet read**.

Because announcement #1 is pre-marked as read by Mohammad (Customer #1), Mohammad will see **4 unread** announcements on first load. Awaludin (Customer #2) has read nothing, so he sees all **5**.

### Generated SQL Query

The Eloquent ORM uses `whereDoesntHave` to generate the following SQL (example for `customer_id = 1`):

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

### Eloquent source code

```php
// app/Http/Controllers/AnnouncementController.php

$unread = Announcement::whereDoesntHave('readByCustomers', function ($query) use ($customerId) {
    $query->where('customer_id', $customerId);
})->latest()->get();
```

---

## Q3 – Mark Announcement as Read

### Using the UI

1. Open http://localhost:5173 in Chrome.
2. Click **Mark as Read** in the navigation bar.
3. Use the **Reference** tables on the page to look up the correct Announcement ID and Customer ID.
4. Enter the numeric **Announcement ID** and **Customer ID** into the form.
5. Click **Submit**.
6. A success message confirms which customer was recorded as having read which announcement.

> **Note:** Submitting the same combination a second time is safe – the backend uses `syncWithoutDetaching`, which is idempotent (no duplicate rows are inserted).

### Using curl / the API directly

```bash
curl -X POST http://localhost:8000/api/v1/announcements/mark-read \
     -H "Content-Type: application/json" \
     -d '{"announcement_id": 2, "customer_id": 1}'
```

Example success response:

```json
{
  "message": "Announcement marked as read.",
  "customer": { "id": 1, "name": "Mohammad", "email": "mohammad@example.com" },
  "announcement": { "id": 2, "title": "New Dashboard Released" }
}
```

---

## Q4 – Environment & Project Setup

### Project structure

```
.
├── docker-compose.yml              # Orchestrates all three services
├── backend/                        # Laravel 11 application
│   ├── Dockerfile
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── AnnouncementController.php
│   │   └── Models/
│   │       ├── Announcement.php
│   │       └── Customer.php
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── ..._create_customers_table.php
│   │   │   ├── ..._create_announcements_table.php
│   │   │   └── ..._create_announcement_customer_table.php
│   │   └── seeders/
│   │       ├── AnnouncementSeeder.php
│   │       └── DatabaseSeeder.php
│   └── routes/
│       └── api.php
└── frontend/                       # React 18 + TypeScript + Vite + Tailwind
    ├── Dockerfile
    ├── src/
    │   ├── api/client.ts
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── pages/
    │   │   ├── UnreadAnnouncements.tsx
    │   │   └── MarkAsRead.tsx
    │   ├── types/index.ts
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

### Database schema

```
customers
  id            BIGINT UNSIGNED  PK  AUTO_INCREMENT
  name          VARCHAR(255)
  email         VARCHAR(255)     UNIQUE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

announcements
  id            BIGINT UNSIGNED  PK  AUTO_INCREMENT
  title         VARCHAR(255)
  body          TEXT
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

announcement_customer          ← pivot table
  id              BIGINT UNSIGNED  PK  AUTO_INCREMENT
  announcement_id BIGINT UNSIGNED  FK → announcements.id  ON DELETE CASCADE
  customer_id     BIGINT UNSIGNED  FK → customers.id      ON DELETE CASCADE
  read_at         TIMESTAMP
  UNIQUE (announcement_id, customer_id)
```

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

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/customers` | List all customers |
| `GET` | `/api/v1/announcements` | List all announcements |
| `GET` | `/api/v1/announcements/unread?customer_id={id}` | Unread announcements for a customer |
| `POST` | `/api/v1/announcements/mark-read` | Mark an announcement as read |

POST body for `/mark-read`:

```json
{
  "announcement_id": 2,
  "customer_id": 1
}
```

---

## AI Usage Disclosure

AI tools were used during this assessment as follows:

| Tool | Usage |
|------|-------|
| **ChatGPT** | Used for implementation brainstorming, scaffolding assistance, documentation drafting, code refinement suggestions |

All final code, project structure decisions, ORM implementation, validation flow, and documentation were reviewed and verified manually before submission.

---

## Time Spent

| Activity | Time |
|----------|------|
| Reading assessment & planning | ~20 min |
| Docker & environment setup | ~20 min |
| Laravel backend (models, migrations, controllers, seeders) | ~40 min |
| React frontend (components, pages, API integration) | ~40 min |
| README & documentation | ~20 min |
| **Total** | **~2 h 20 min** |

