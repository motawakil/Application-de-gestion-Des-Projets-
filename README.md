# ProjectFlow

**ProjectFlow** is a full-stack project and task management application built with Django REST Framework and React. It supports multi-user authentication, project and task CRUD, calendar and kanban views, holiday warnings, and an AI-powered chatbot (Gemini) that can answer questions about your tasks in natural language.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Running the Database with Docker](#running-the-database-with-docker)
- [Backend Setup & Installation](#backend-setup--installation)
- [Frontend Setup & Installation](#frontend-setup--installation)
- [API Overview](#api-overview)
- [Features](#features)

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router, Tailwind CSS, Lucide React |
| Backend   | Django 5, Django REST Framework, SimpleJWT |
| Database  | PostgreSQL 15 (via Docker)              |
| AI        | Google Gemini 2.5 Flash API             |
| Auth      | JWT (access + refresh tokens)           |
| Filtering | django-filter                           |

---

## Project Structure

```
projectflow/
├── backend/
│   ├── core/                  # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api/                   # Main app: models, views, serializers
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── requirements.txt
│   ├── manage.py
│   └── .env                   # ← You create this (see below)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # Dashboard sub-components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── holidayService.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env                   # ← You create this (see below)
│
└── docker-compose.yml
```

---

## Prerequisites

Make sure the following are installed on your machine before starting:

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/) and npm
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free to generate)

---

## Environment Configuration

### Backend — `backend/.env`

Create a file named `.env` inside the `backend/` folder with the following content:

```env
# Django
SECRET_KEY=your-secret-django-key-change-this-in-production
DEBUG=True

# Database — must match docker-compose.yml values
DB_NAME=projectflow_db
DB_USER=projectflow_user
DB_PASSWORD=projectflow_password
DB_HOST=localhost
DB_PORT=5432

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get your Gemini API key:**

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it as the value of `GEMINI_API_KEY`


---


## Running the Database with Docker

The PostgreSQL database is fully managed by Docker. You only need to run one command and the database will be ready — no installation or manual setup required.

From the **root of the project** (where `docker-compose.yml` lives):

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 container with the following configuration:

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    container_name: task_postgres_db
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_DB=taskdb
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

> The data is persisted in a Docker volume (`postgres_data`), so stopping and restarting the container will not lose your data.

**To stop the database:**

```bash
docker-compose down
```

**To stop and delete all data (full reset):**

```bash
docker-compose down -v
```

---

## Backend Setup & Installation

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment

```bash
# Create the virtual environment
python -m venv venv

# Activate it — macOS / Linux
source venv/bin/activate

# Activate it — Windows
venv\Scripts\activate
```

You should see `(venv)` appear at the start of your terminal prompt.

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

The `requirements.txt` includes:

```

Plaintext
django
djangorestframework
django-cors-headers
psycopg2-binary
djangorestframework-simplejwt
python-dotenv
google-generativeai
django-filter
```

### 4. Apply database migrations

Make sure Docker is running and the database container is up before this step.

```bash
python manage.py migrate
```

This creates all the necessary tables in PostgreSQL (users, projects, tasks).

### 5. (Optional) Create a superuser for the Django admin panel

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password. The admin panel is then accessible at [http://localhost:8000/admin](http://localhost:8000/admin).

### 6. Start the Django development server

```bash
python manage.py runserver
```

The backend API is now running at: **http://localhost:8000/api/**

---

## Frontend Setup & Installation

### 1. Open a new terminal and navigate to the frontend folder

```bash
cd frontend
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The React app is now running at: **http://localhost:5173**

Open your browser at that address. You can register a new account and start creating projects and tasks immediately.

---

## Running Everything Together

Here is the full start-up sequence from scratch:

```bash
# Terminal 1 — Start the database
docker-compose up -d

# Terminal 2 — Start the backend
cd backend
source venv/bin/activate      # or venv\Scripts\activate on Windows
python manage.py migrate       # only needed the first time
python manage.py runserver

# Terminal 3 — Start the frontend
cd frontend
npm install                    # only needed the first time
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Overview

All API endpoints are prefixed with `/api/`.

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:---:|
| POST | `/register/` | Create a new user account | No |
| POST | `/token/` | Get JWT access + refresh tokens | No |
| POST | `/token/refresh/` | Refresh an expired access token | No |
| GET | `/register/me/` | Get current user info | Yes |
| GET / POST | `/projects/` | List or create projects | Yes |
| GET / PATCH / DELETE | `/projects/:id/` | Retrieve, update, or delete a project | Yes |
| GET / POST | `/tasks/` | List or create tasks (filter by `?project=`, `?status=`, `?priority=`) | Yes |
| GET / PATCH / DELETE | `/tasks/:id/` | Retrieve, update, or delete a task | Yes |
| GET | `/tasks/by-date/?date=YYYY-MM-DD` | Get tasks due on a specific date | Yes |
| GET | `/tasks/next-days/?days=N` | Get tasks due in the next N days | Yes |
| POST | `/chatbot/` | Send a natural language message to the AI | Yes |

Authentication uses **JWT Bearer tokens**. Include the token in every protected request:

```
Authorization: Bearer <your_access_token>
```

---

## Features

**Projects**
- Create, edit, and delete projects
- Each project is private to its owner

**Tasks**
- Create tasks with title, description, status (`TODO` / `IN_PROGRESS` / `DONE`), priority (`LOW` / `MEDIUM` / `HIGH`), and optional due date
- Filter and sort tasks by status, priority, and date

**Dashboard Views**
- **Grid** — project cards overview
- **List** — sortable and filterable task table across all projects
- **Kanban** — tasks grouped by status in columns
- **Calendar** — tasks displayed on a monthly calendar

**AI Chatbot (Gemini)**
- Ask questions like *"What tasks do I have tomorrow?"* or *"Show me tasks for the next 3 days"*
- Falls back to a conversational reply for general questions

**Holiday Warnings**
- When setting a task due date, the app warns you if the selected date is a public holiday in France