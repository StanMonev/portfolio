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
- `FROM_EMAIL`
- `RESEND_API_KEY`
- `RECAPTCHA_API_KEY`
- `RECAPTCHA_PROJECT_ID`
- `RECAPTCHA_SITE_KEY`
- `TO_EMAIL`

Email delivery uses Resend. `FROM_EMAIL` is expected to be an address on a domain verified in Resend, while `TO_EMAIL` can be any inbox that should receive contact form messages.

The contact form and resume download use Google Cloud reCAPTCHA score-based verification. Create a reCAPTCHA website key, add the site key to `RECAPTCHA_SITE_KEY`, the Google Cloud project ID to `RECAPTCHA_PROJECT_ID`, and an API key with access to create reCAPTCHA assessments to `RECAPTCHA_API_KEY`. `RECAPTCHA_MIN_SCORE` is optional and defaults to `0.5`.

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

The production build step minifies browser JavaScript from `public/assets/javascript` into `public/assets/javascript/dist`. At runtime, `NODE_ENV=production` makes the app serve those minified files when they are present, with an automatic fallback to the original files.

Railway deployment settings are captured in `railway.json`: Railpack runs the build script, Knex migrations run in the pre-deploy phase, and the app starts with `npm start`.

## Scripts
- `npm run build` - Frontend JavaScript production build
- `npm run build:js` - Minify browser JavaScript into `public/assets/javascript/dist`
- `npm run start:dev` - Development server with nodemon
- `npm run start:prod` - Production server with node
- `npm run migrate` - Latest Knex migrations

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
- `routes/` - Feature route modules composed by `routes/index.js`
- `controllers/` - Feature controller logic
- `middleware/` - Request middleware such as auth, validation, honeypot, and reCAPTCHA checks
- `validators/` - Request validation chains
- `services/` - Service layer utilities
- `utils/` - Shared response/util helpers
- `data/` - Static application data used by rendered pages
- `models/` - Data models
- `views/` - EJS templates and partials
- `public/` - Static assets (CSS, JS, images, resume files)
- `db/` - Knex migrations and DB setup
