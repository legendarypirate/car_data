# NDA AUTO — car_data

Monorepo for the NDA AUTO dealership site: public storefront, admin CMS, and API.

| App | Path | Port | Stack |
|---|---|---|---|
| Public site | `car/` | 3000 | Next.js |
| Admin | `admin/` | 3001 | Next.js |
| API | `backend/` | 4000 | Express + PostgreSQL |

## Setup

```bash
cp backend/.env.example backend/.env
# set DB_PASSWORD and other secrets locally — never commit .env files

cd backend && npm install && npm run dev
cd admin && npm install && npm run dev
cd car && npm install && npm run dev
```

API defaults to `http://localhost:4000`. Point `car/.env.local` and `admin/.env.local` at `NEXT_PUBLIC_API_URL=http://localhost:4000`.
