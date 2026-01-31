# E-School – School Management

A desktop-style web application for managing a school: teachers, classes, students, grades, absences, lesson topics, activities, and announcements. Roles include **Administrator**, **Main Teacher**, **Teacher**, and **Student**. The UI is available in **English** and **Albanian**.

---

## Description

- **Admin:** Create main teachers and teachers (with generated credentials), assign classes and subjects, create school **activities** (e.g. Summer day, Day of technology) and **announcements** (cancelled/postponed subjects), choose which classrooms see each.
- **Main teacher:** Manage homeroom class and students, add lesson topics, record absences and grades, switch to other classes to view/add records. Sees activities and announcements for the selected class, plus a **calendar** of activities.
- **Teacher:** Select a class from the dashboard; add lesson topics, absences, and grades only for subjects assigned by the admin.
- **Student:** View own grades and absences, and a calendar of activities for their class.

Notifications (activities and announcements) appear in a bell icon next to the language switcher (AL/EN) for main teachers and students.

---

## Setup

### Requirements

- **PHP** 8.2+ (Laravel backend)
- **Composer**
- **Node.js** 18+ and **npm**
- **PostgreSQL** (or MySQL; adjust `.env` and DB driver)

### 1. Backend (Laravel)

```bash
cd backend
cp .env.example .env
# Edit .env: set DB_DATABASE, DB_USERNAME, DB_PASSWORD (and DB_CONNECTION=pgsql for PostgreSQL)
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend runs at **http://127.0.0.1:8000** by default.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** by default.

### 3. Use the app

1. Open **http://localhost:5173** in the browser.
2. Ensure the frontend is configured to call the backend API (e.g. `VITE_API_URL=http://127.0.0.1:8000` or equivalent in `frontend/.env` if your project uses it).
3. Log in with credentials created by the admin (e.g. after creating a teacher, use the generated username and password).

---

## Project structure

- **`backend/`** – Laravel API (auth, teachers, classes, subjects, activities, announcements, grades, absences, lesson topics).
- **`frontend/`** – React SPA (Vite), role-based routes and dashboards, i18n (EN/sq).

Run backend and frontend in two terminals so both servers are up while developing.
