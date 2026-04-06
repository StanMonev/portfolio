# Resume Website

Personal resume/portfolio website built with Node.js, Express, EJS, and PostgreSQL.

## Tech Stack
- Node.js
- Express
- EJS
- PostgreSQL
- Knex (migrations)

## Requirements
- Node.js 18+ (recommended)
- PostgreSQL

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create your local environment file:
```bash
cp .env.example .env
```
On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

3. Fill in `.env` values (at minimum):
- `PORT`
- `NODE_ENV`
- `SECRET_KEY`
- `DEV_DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `EMAIL_HOST`
- `EMAIL_HOST_PORT`
- `EMAIL_PASSWORD`
- `FROM_EMAIL`
- `TO_EMAIL`

4. Run database migrations:
```bash
npm run migrate
```

5. Start the app:
```bash
npm run start:dev
```

For production:
```bash
npm run start:prod
```

The production build minifies the browser JavaScript files from `public/assets/javascript` into `public/assets/javascript/dist`. When `NODE_ENV=production`, the app will serve the minified files if they exist and fall back to the original files otherwise.

## Scripts
- `npm run build` - Run the frontend JavaScript production build
- `npm run build:js` - Minify browser JavaScript into `public/assets/javascript/dist`
- `npm run start:dev` - Run with nodemon
- `npm run start:prod` - Build the frontend JavaScript, then start the app with node
- `npm run migrate` - Run latest migrations

## Database Commands
Run all migrations:
```bash
npx knex migrate:latest
```

Rollback all migrations:
```bash
npx knex migrate:rollback --all
```

## Project Structure
- `server.js` - App entry point
- `routes/` - Route definitions
- `controllers/` - Controller logic
- `services/` - Service layer utilities
- `models/` - Data models
- `views/` - EJS templates and partials
- `public/` - Static assets (CSS, JS, images, resume files)
- `db/` - Knex migrations and DB setup
