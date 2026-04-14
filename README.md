# ProManager — Multi-Company Project Management System

## Tech Stack
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Frontend:** React, Vite, TailwindCSS (Step 7)

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL running locally (or use a hosted instance)

### Backend Setup
```bash
cd server
cp .env.example .env        # Edit with your DB credentials
npm install
npm run db:migrate           # Run database migrations
npm run db:seed              # Seed initial data
npm run dev                  # Start dev server on port 5000
```

### API Endpoints

#### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/auth/me` | Yes | Get profile |
| POST | `/api/auth/logout` | Yes | Clear cookie |

#### Projects (all require auth)
| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| GET | `/api/projects` | Any | List (filter, search, paginate) |
| GET | `/api/projects/stats` | Any | Dashboard stats |
| GET | `/api/projects/:id` | Any | Get single project |
| POST | `/api/projects` | Admin, Manager | Create project |
| PATCH | `/api/projects/:id` | Admin, Manager | Update project |
| DELETE | `/api/projects/:id` | Admin only | Delete project |

#### Company (all require auth)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/company/profile` | Company info + config |
| GET | `/api/company/members` | List team members |

#### Other
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
