## E‑School – School Management Platform

A desktop‑style web application for managing a school: teachers, classes, students, grades, absences, lesson topics, activities, and announcements.  
The system supports multiple user roles (**Administrator**, **Main Teacher**, **Teacher**, **Student**) and is fully localized in **English** and **Albanian**.

---

## Features

- **Role‑based access control**
  - **Administrator**
    - Create main teachers and subject teachers (with automatically generated credentials).
    - Assign teachers to classes and subjects.
    - Create **school activities** (e.g. Summer Day, Technology Day).
    - Create **announcements** (e.g. cancelled or postponed lessons) and choose which classes see each one.
  - **Main Teacher (Homeroom)**
    - Manage homeroom class and students (basic info, enrollment, etc.).
    - Add lesson topics, record absences, and enter grades for their class.
    - Switch to other classes they are assigned to in order to view/add records.
    - View activities and announcements relevant to the currently selected class.
  - **Teacher**
    - Select a class from the dashboard.
    - Add lesson topics, absences, and grades **only** for subjects assigned by the admin.
    - See activities and announcements that apply to their classes.
  - **Student**
    - Securely log in to see personal information only.
    - View **own grades and absences**.
    - See a **calendar** of activities and announcements for their class.

- **Notifications & calendar**
  - Central **notifications bell** next to the language switcher (AL/EN) for main teachers and students.
  - Activities and announcements displayed in a **calendar‑style** overview.

- **Localization (i18n)**
  - Full UI available in **English** and **Albanian**.
  - Language switcher integrated into the main layout.

- **Modern UI**
  - React SPA with a desktop‑like layout.
  - Role‑specific dashboards.

---

## Tech stack

- **Frontend**
  - **React 18** + **Vite**
  - **React Router** for routing
  - **i18next** / **react‑i18next** for translations
  - **Axios** for HTTP client
  - **Tailwind CSS** for styling
  - Electron dependency available for desktop‑style packaging (if needed)

- **Backend**
  - **Laravel** (PHP 8.2+)
  - REST‑like API endpoints for authentication, users, classes, subjects, activities, announcements, grades, absences, lesson topics.
  - **PostgreSQL** (recommended) or **MySQL** database (configurable via `.env`).

---

## Project structure

- **`backend/`** – Laravel API application
  - Authentication & authorization
  - Domain models: teachers, main teachers, students, classes, subjects, activities, announcements, grades, absences, lesson topics.
  - API routes for the frontend.
- **`frontend/`** – React SPA (Vite)
  - Role‑based routing and dashboards.
  - Pages for login, class dashboards, grade and absence views, activities calendar.
  - Internationalization (EN/AL).

You typically run **backend** and **frontend** in two separate terminals during development.

---

## Prerequisites

Make sure you have the following installed:

- **PHP** 8.2+ (with required extensions for Laravel)
- **Composer**
- **Node.js** 18+ and **npm**
- **PostgreSQL** (or MySQL; adapt `.env` accordingly)

Optional (for a smoother local experience):

- **Postman** or **Insomnia** for testing API endpoints.
- **pgAdmin** / another DB GUI.

---

## Backend setup (Laravel)

From the project root:

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Create environment file
cp .env.example .env

# 3. Generate application key
php artisan key:generate

# 4. Configure database in .env
#   DB_CONNECTION=pgsql           # or mysql
#   DB_HOST=127.0.0.1
#   DB_PORT=5432                  # 3306 for MySQL
#   DB_DATABASE=eschool
#   DB_USERNAME=your_user
#   DB_PASSWORD=your_password

# 5. Run migrations (and seeders if you add them)
php artisan migrate
# php artisan db:seed             # optional, if defined

# 6. Run the development server
php artisan serve
```

By default the backend will be available at **`http://127.0.0.1:8000`**.

---

## Frontend setup (React + Vite)

From the project root:

```bash
cd frontend

# 1. Install JS dependencies
npm install

# 2. (Optional) configure API base URL in .env
#   VITE_API_URL=http://127.0.0.1:8000

# 3. Start development server
npm run dev
```

The frontend usually runs at **`http://localhost:5173`** (Vite default).

---

## Running the full app locally

1. **Start the backend**
   - In one terminal:
     - `cd backend`
     - `php artisan serve`
2. **Start the frontend**
   - In another terminal:
     - `cd frontend`
     - `npm run dev`
3. **Open the app**
   - Visit **`http://localhost:5173`** in your browser.
4. **Log in**
   - Use credentials created by the **Admin** in the system (for example, after creating a teacher, use the generated username and password).

---

## Environment variables

### Backend (`backend/.env`)

At minimum you should configure:

- **App**
  - `APP_NAME=E-School`
  - `APP_ENV=local`
  - `APP_KEY=...` (generated by `php artisan key:generate`)
  - `APP_DEBUG=true`
- **Database**
  - `DB_CONNECTION=pgsql` (or `mysql`)
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_DATABASE=eschool`
  - `DB_USERNAME=...`
  - `DB_PASSWORD=...`

You can also configure mail, queues, cache, etc. according to your needs.

### Frontend (`frontend/.env`)

Typical variables:

- `VITE_API_URL=http://127.0.0.1:8000`

If you deploy the backend somewhere else, update `VITE_API_URL` accordingly.

---

## Development workflow

- **Start services**
  - Run the Laravel backend.
  - Run the React frontend via Vite.
- **Make API changes**
  - Update routes/controllers in `backend/`.
  - Run migrations when changing DB schema.
- **Update UI**
  - Modify React components and pages in `frontend/`.
  - Use Tailwind classes for styling.
  - Update translation JSON files when adding new strings (EN/AL).
- **Check translations**
  - The frontend includes a script (`npm run check-translations`) to help validate translation keys.

---

## Testing & quality (optional suggestions)

Depending on how far you want to take the project, you can:

- **Backend**
  - Add Laravel feature and unit tests (e.g. `php artisan test`).
  - Use factories and seeders for sample data (demo school, demo users).
- **Frontend**
  - Add component tests (e.g. with Vitest/Testing Library).
  - Enforce linting regularly via `npm run lint`.

---

## Deployment notes (high level)

- **Backend**
  - Deploy the Laravel app to a PHP‑capable host (Laravel Forge, VPS, Docker, etc.).
  - Run migrations on the production database.
  - Set environment variables (`APP_KEY`, DB config, etc.) on the server.
- **Frontend**
  - Build a production bundle:
    - `cd frontend`
    - `npm run build`
  - Serve the built assets from a static host or behind a reverse proxy that points to the backend API.

---

## Roadmap ideas

- Parent / guardian accounts linked to students.
- Attendance reports and exportable grade reports (PDF).
-.Advanced analytics dashboards (per‑class, per‑subject performance).
- Integration with SMS or email for announcements.
- Richer notifications (push, in‑browser toasts, etc.).

---

## License

This project uses Laravel and other open‑source components licensed under MIT or compatible licenses.  
You are free to adapt and extend this project for your own school or as a learning resource.
