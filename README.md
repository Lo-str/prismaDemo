# PrismaDemo

REST API built with Express, Prisma, and TypeScript.

## How to run the server

1. Clone the repo and run `npm i`
2. Add a `.env` file with your `DATABASE_URL`
3. Run `npx prisma generate`
4. Run `npm run dev`

## How to test routes

Use Postman or Insomnia with `http://localhost:3000` as the base URL.

| Method | Route              | What it does                            |
|--------|--------------------|-----------------------------------------|
| GET    | `/users`           | Get all users                           |
| GET    | `/users/:language` | Get users who speak a specific language |
| POST   | `/users`           | Create a new user                       |
| PUT    | `/users/:email`    | Add/modify languages to a user          |
| DELETE | `/users`           | Delete all users under 18               |

POST body example:
```json
{
  "name": "Amara Diallo",
  "email": "amara.diallo@example.com",
  "age": 28,
  "languages": ["French", "English"]
}
```

PUT body example:
```json
{
  "languages": ["Spanish"]
}
```

## New routes

- **GET by language** — filters users by a spoken language
- **PUT by email** — adds new languages to an existing user
- **DELETE under 18** — removes underage users and returns a count