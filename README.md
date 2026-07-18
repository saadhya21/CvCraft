# CvCraft — AI-Powered Resume Platform ✅

A premium, full-stack resume platform combining AI-driven feedback, comparison, and generation — built with a refined "drafting-table" design aesthetic.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase account (for auth & storage)
- An OpenRouter API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/saadhya21/CvCraft.git
cd CvCraft

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Setup

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Create `backend/.env`:

```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_BUCKET=resumes
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🖥️ User Interface Overview

CvCraft's interface is built around a calm, warm aesthetic with beige/cream backgrounds, espresso-brown text, and copper accents. The app is split into two main zones:

### Landing Page
Hero section with CTA → Features grid → Interactive resume preview → AI review demo → ATS score card → How it works → Testimonials → Pricing → FAQ → Footer. A floating blueprint-grid background and copper cursor trail provide visual depth.

### Dashboard (Post-Login)
- **Navbar**: CvCraft logo (left-arrow icon), theme toggle, user avatar
- **Feature Cards**: Three interactive cards (Reviewer, Selector, Builder) — first click highlights with espresso border, second click navigates
- **History Block**: Collapsible panel showing past activity from localStorage, with delete per entry

### Sign In
Email/password login with toggle to create account, phone OTP flow, and Google/GitHub OAuth buttons.

---

## 📖 How to Use

### Resume Reviewer
1. From the Home dashboard, click the **Resume Review** card twice
2. Upload a resume (PDF, PNG, JPG, or HEIC)
3. Wait for AI analysis (~5-10 seconds)
4. View your **overall score** (0-10) with a circular progress ring
5. Explore **category scores**: Formatting, Content Clarity, Impact & Metrics, ATS Compatibility
6. Expand **Strengths**, **Flaws**, and **Recommendations** sections
7. Click the score card for a rating popup

### Resume Selector
1. From the Home dashboard, click the **Resume Selector** card twice
2. Upload **2–5 resumes** using drag-and-drop or the file picker
3. Optionally select from **Saved Resumes** (previously analyzed resumes)
4. Paste a **Job Description** or target role
5. Click "Compare" and wait for AI evaluation
6. View the **winner** card (green) with best-fit reasoning
7. Scroll through **score comparison** for all resumes
8. Expand each resume's **detail card** to see strengths and gaps

### Resume Builder
1. From the Home dashboard, click the **Resume Builder** card twice
2. Progress through **7 steps**: Personal Info (with photo) → Summary & Role → Skills → Experience → Education & Languages → Certifications & Projects → Review
3. At the Review step, click **Generate Resume**
4. Preview the A4 **navy-blue master-spec resume** with two-column layout
5. Use **Export / Print** to download or print the result

---

## 📜 Available Scripts

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server on `:5173` |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview production build locally |

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot-reload via `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

---

## 🔍 Features Explained

### AI Resume Reviewer
Upload a resume and receive a structured analysis. The AI (Claude 3.5 Sonnet via OpenRouter) evaluates:
- **Formatting**: Layout, spacing, font consistency
- **Content Clarity**: How well achievements are communicated
- **Impact & Metrics**: Use of quantifiable results
- **ATS Compatibility**: Keyword presence, section headers, parsability

Results are color-coded: green (≥8/10) or red (<8/10) for instant visual feedback.

### AI Resume Selector
Upload multiple resumes and a job description. The AI compares every resume against the JD and against each other, producing:
- A **winner** card explaining why one resume fits best
- A **score comparison** ranking all candidates
- Per-resume **strengths** and **gaps** tied to the specific job description
- Winners highlighted in green, losers in red

### AI Resume Builder
Answer 7 simple prompts and the AI generates a complete, ATS-friendly resume. The output renders as a printable A4 document in a professional navy-blue master-spec layout with:
- Photo (left-aligned, 90×112px)
- Name in ALL CAPS
- Contact info with icons
- Two-column section layout
- Structured education entries (degree, institution, year, GPA)

---

## 📊 Diff Viewer

CvCraft's Resume Selector doubles as a **diff viewer** for resumes. After comparison:
- **Winner/Loser Theme**: The winning resume gets green borders and badges; all others display red
- **Side-by-side detail cards**: Each resume's strengths and gaps are listed, making it easy to spot what differentiates the best from the rest
- **Category breakdown**: Compare content quality, formatting, keyword match, impact metrics, and overall fit scores across all candidates

---

## 📱 Responsive Behaviour

CvCraft is fully responsive across desktop, tablet, and mobile:

| Breakpoint | Behaviour |
|------------|-----------|
| **Desktop (≥1024px)** | Full multi-column layouts, large typography, rich hover effects |
| **Tablet (768–1023px)** | 2-column grids, slightly compact spacing |
| **Mobile (<768px)** | Single-column stack, bottom-sheet rating popups, larger touch targets (`min-h-[48px]`), fluid `clamp()` text sizing |

Key responsive patterns:
- Navbar collapses padding: `px-4` mobile → `px-6` desktop
- Feature cards: `grid-cols-1` mobile → `sm:grid-cols-3` desktop
- Reviewer results: stacked on mobile, side-by-side grid on desktop
- OAuth buttons: column on mobile, 2-column grid on desktop
- Builder photo section: stacks below inputs on mobile, side-by-side on desktop

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails** | Run `npm install` in both `frontend/` and `backend/`. Delete `node_modules` and `package-lock.json` if corrupted. |
| **OAuth not working** | Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `frontend/.env`. Configure Google/GitHub providers in Supabase dashboard. |
| **AI features return errors** | Verify `OPENROUTER_API_KEY` in `backend/.env`. Check OpenRouter credits. |
| **Backend won't start** | Ensure `.env` exists in `backend/` with all required vars. Port 3001 must be free. |
| **CORS errors** | Backend uses `cors()` with default settings. For production, restrict with specific origins. |
| **File upload fails** | Max file size is 10MB. Allowed types: PDF, PNG, JPG, HEIC. |

---

## 📚 Learning Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS v3](https://tailwindcss.com/docs)
- [Framer Motion](https://motion.dev/)
- [Express.js](https://expressjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [OpenRouter API](https://openrouter.ai/docs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code:
- Passes TypeScript type-checking (`tsc --noEmit` in both `frontend/` and `backend/`)
- Follows the existing code style and naming conventions
- Is tested where applicable
- Does not commit `.env` files or secrets

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🧭 Next Steps

- [ ] Set up Supabase OAuth providers (Google & GitHub) in production
- [ ] Deploy backend to a cloud provider (Railway, Render, or Fly.io)
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Add user-specific saved resume history (migrate from localStorage to Supabase)
- [ ] Implement the planned folder structure with feature-based modules
- [ ] Add remaining SQL migrations for full 8-table schema
- [ ] Write unit and integration tests
- [ ] Add dark mode support

---

## 😊 Happy Coding!

Built with ❤️ by [saadhya21](https://github.com/saadhya21). If you find CvCraft useful, give it a ⭐ on GitHub!
