# OppPilot

An AI agent that helps Indian college students find, verify and prepare
applications for scholarships, internships, hackathons and government schemes,
before the deadline.

## Problem

College students in India have no single, trustworthy, personalised place to
discover scholarships, internships, hackathons and schemes. Listings are
scattered, unverified and repetitive to apply for.

## What the app does today

- Landing page explaining the agent: Discover, Verify, Match, Prep & Remind, and
  "You always press submit".
- Email and password accounts.
- A three-step onboarding that saves the student profile (studies, background,
  interests and skills).
- A dashboard placeholder that greets the student; "Find opportunities" is
  disabled until the agent ships.
- A Supabase schema with row-level security for profiles, listings, matches,
  saved listings and agent runs.

## Planned

- Discover opportunities from the live web with the TinyFish Search, Fetch and
  Agent APIs.
- Show deadline, eligibility and the source link for each listing on one card.
- Match listings to the student's profile and remind them before deadlines.

## Quickstart

```bash
nvm use
corepack enable
pnpm install
cp .env.example .env   # then fill in your Supabase project
pnpm dev
```

Open <http://127.0.0.1:3000>. See [DEVELOPMENT.md](./DEVELOPMENT.md) for the
Supabase setup, commands and project layout.

## Tech

TanStack Start (React 19, TypeScript), TanStack Router, Query and Form, Tailwind
CSS 4, shadcn/ui on Base UI, Zod 4 and Supabase (Postgres, Auth, row-level
security).

The first commits come from the TanStack Start starter template the project
began from; OppPilot's own work starts after them.

## Team Code Crusaders

- Esha Kumar (Team Lead)
- Khushi Srivastava

IGDTUW | HackIIITD 2026 (Esya '26, IIIT Delhi)
