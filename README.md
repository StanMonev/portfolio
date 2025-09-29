# Outdated README 
Needs correction, as this is now a monorepo, which includes the Resume Website.

# Resume Website

This project contains my CV Website and it's made with the following tools:
- NodeJS
- Express
- PostgreSQL

Dependencies (install with `npm install`):
- dotenv: 16.0.3
- ejs: 3.1.8
- express: 4.18.2
- express-validator: 7.0.1
- express-session: 1.18.0
- nodemailer: 6.9.7
- bcrypt: 5.1.1
- connect-flash: 0.1.1
- geoip-lite: 1.4.10
- knex: 3.1.0
- passport: 0.7.0
- passport-local: 1.0.0
- pg: 8.12.0

Start development server with `npm run devStart`.

# Database actions

### Rollback all migrations
```npx knex migrate:rollback --all```

### Run all migrations
```npx knex migrate:latest```
