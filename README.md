# Ai-sharks — E‑Book Websites

Professional, production-ready Next.js starter for an e-book / marketing website.

Short summary:

- **Ai-sharks** is a modern Next.js (App Router) starter focused on clean design, fast performance, and easy customization for e-book or marketing websites.
- Built with TypeScript, PostCSS and a small component library in `app/components` for pages like Home, About, Services and Contact.

English Short + Hindi tagline:

Ai-sharks — Elegant e-book website template.

## Key Features

- Next.js (App Router) with TypeScript
- Modular component structure (Header, Footer, Hero, Services)
- Responsive design and accessible patterns
- Simple design system: colors, typography and CSS variables
- Ready to deploy on Vercel or any Node-compatible host

## Demo / Local Preview

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm run start
```

Available scripts (from `package.json`):

- `dev` — runs Next.js dev server
- `build` — production build
- `start` — start production server
- `lint` — run ESLint (if configured)

## Design System / Styling Guidelines

This project is intentionally small and opinionated. Use the following tokens and suggestions when extending the UI.

Suggested color palette

- Primary: #0B5FFF (Ocean Blue)
- Secondary: #00C2A8 (Teal)
- Accent: #FFB020 (Warm Amber)
- Neutral-900 (Dark text): #0B1220
- Neutral-100 (Background): #F7FAFC
- Surface / Muted: #E6EEF8

Recommended CSS variables (example `:root`):

```css
:root {
	--color-primary: #0B5FFF;
	--color-secondary: #00C2A8;
	--color-accent: #FFB020;
	--color-bg: #F7FAFC;
	--color-surface: #E6EEF8;
	--color-text: #0B1220;
	--radius-sm: 6px;
	--radius-md: 12px;
	--space-1: 8px;
	--space-2: 16px;
	--space-3: 24px;
}
```

Typography

- Primary font: `Inter` (or `Poppins` for a slightly friendlier tone)
- Fallbacks: system UI stack
- Scale example: 14px (base), 16px (body comfortable), 20–32px (headings)

Example import (Next.js / Google Fonts): use `next/font` to load `Inter` or `Poppins` for best performance.

Accessibility

- Maintain color contrast (AA at minimum for body text)
- Use semantic HTML and proper focus outlines for keyboard users

Design tokens are intentionally simple so you can move them into a global CSS/SCSS file or Tailwind config.

## Project Structure

Top-level overview (trimmed to the important bits):

```
ai-sharks/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  ├─ service/page.tsx
│  └─ components/
│     ├─ Header.tsx
│     ├─ Footer.tsx
│     ├─ hero.tsx
│     ├─ service.tsx
│     ├─ servicespage.tsx
│     ├─ about.tsx
│     └─ aboutuspage.tsx
├─ public/            # Static assets (images, favicon)
├─ src/               # App source (if present)
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
└─ tsconfig.json
```

Notes on structure

- Keep page-level routes inside `app/` (App Router). Keep small visual components inside `app/components/`.
- Consider splitting larger components into `ui/` and `sections/` if the project grows.

## How to Extend / Customize

- Colors: update `globals.css` or move tokens into a centralized CSS/SCSS module.
- Fonts: use `next/font` to load fonts and set CSS variables for font-family.
- Components: follow present component patterns (props, small, stateless where possible).

## Deployment

- Recommended: Vercel (automatic support for Next.js App Router)
- Alternate: Any Node host or static export (if no server-side logic is used)

## Contributing

- Fork the repo and create a feature branch for new features or bug fixes.
- Keep changes focused and add documentation for any public API or UI that changes.
- Open a pull request describing your change and why it helps.

## License

This repository does not include a license file by default. Add a `LICENSE` (MIT, Apache-2.0, etc.) to make usage clear.

## Authors & Contact

- Author: Ai-sharks
- Repo: example-maintainer@example.com

---

If you want, I can also:

- add a `LICENSE` file (MIT)
- create a short CONTRIBUTING.md
- create GitHub Actions to run linting and type-checks on PRs

If you'd like those, tell me which to add next.
