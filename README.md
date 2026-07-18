# CvCraft — AI-Powered Resume Platform ✅

A premium, full-stack resume platform combining AI-driven feedback, comparison, and generation — built with a refined "drafting-table" design aesthetic.

## 🎯 Features

- **Resume Reviewer**: AI-powered scoring and section-by-section feedback with color-coded results
- **Resume Selector**: Upload and compare multiple resumes, ranked against each other
- **Resume Builder**: Guided Q&A flow that generates a complete resume from scratch

## 🛠️ Tech Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS
**Backend:** Node.js + Express + TypeScript
**Database & Auth:** Supabase (PostgreSQL + Auth + Storage + Row Level Security)
**AI:** OpenRouter (Claude 3.5 Sonnet)

## 🎨 Design Language

- Deep ink navy (#0D1321) with warm copper accent (#C97E4B)
- Fraunces for display type, Inter for body, JetBrains Mono for data
- Blueprint grid background with a glowing copper cursor trail

## 🚀 Getting Started

npm install
npm run dev

Create a .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

## 📁 Project Structure

```
cvcraft/
├── frontend/
│   ├── src/
│   │   ├── assets/              # fonts, images, blueprint grid texture
│   │   ├── components/
│   │   │   ├── ui/              # buttons, cards, inputs (shared design system)
│   │   │   ├── layout/          # navbar, sidebar, dashboard shell
│   │   │   └── cursor/          # copper cursor trail effect
│   │   ├── features/
│   │   │   ├── reviewer/        # Resume Reviewer feature
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── ReviewerPage.tsx
│   │   │   ├── selector/        # Resume Selector feature
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── SelectorPage.tsx
│   │   │   └── builder/         # Resume Builder feature
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── BuilderPage.tsx
│   │   ├── auth/                # login, signup, session handling
│   │   ├── lib/
│   │   │   └── supabaseClient.ts
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── reviewer.routes.ts
│   │   │   ├── selector.routes.ts
│   │   │   ├── builder.routes.ts
│   │   │   └── auth.routes.ts
│   │   ├── controllers/
│   │   │   ├── reviewer.controller.ts
│   │   │   ├── selector.controller.ts
│   │   │   └── builder.controller.ts
│   │   ├── services/
│   │   │   ├── openrouter.service.ts   # Claude 3.5 Sonnet calls
│   │   │   └── supabase.service.ts
│   │   ├── middleware/
│   │   │   ├── asyncHandler.ts
│   │   │   └── auth.middleware.ts
│   │   ├── types/
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/
│   ├── migrations/               # SQL schema files (8-table schema)
│   └── config.toml
│
├── .gitignore
└── README.md
```

