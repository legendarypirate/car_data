# NDA AUTO — car_data

Monorepo for the NDA AUTO dealership site: public storefront, admin CMS, and API.

| App | Path | Port | Stack |
|---|---|---|---|
| Public site | `car/` | 4000 | Next.js |
| API | `backend/` | 4001 | Express + PostgreSQL |
| Admin | `admin/` | 4002 | Next.js |

## Setup

```bash
cp backend/.env.example backend/.env
# set DB_PASSWORD and other secrets locally — never commit .env files

cd backend && npm install && npm run dev
cd admin && npm install && npm run dev
cd car && npm install && npm run dev
```

API defaults to `http://localhost:4001`. Set `API_URL` and `NEXT_PUBLIC_API_URL` in `car/.env.local` (and `admin/.env.local`). In production, set both to `https://carapi.teensclub.mn` and redeploy the site so the server can read `API_URL` at runtime.
