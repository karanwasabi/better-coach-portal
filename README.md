# better-coach-portal

Coach-facing web app (Next.js).

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** (`corepack enable` or [pnpm.io](https://pnpm.io/installation))

## First clone

```bash
cd better-coach-portal
pnpm install
```

`pnpm install` runs the **`prepare`** script, which registers **Husky** Git hooks in your local clone.

## Commands

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

## Git hooks (Husky)

- **pre-commit**: **lint-staged** — ESLint with `--fix` and Prettier on staged `*.{js,jsx,ts,tsx}`; Prettier on staged `*.{css,md,json}`.
- **commit-msg**: **commitlint** — messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat:`, `chore:`, `fix:`).
- **pre-push**: **`pnpm build`** — production build must succeed before `git push`.

Check a message without committing:

```bash
echo "feat: example change" | pnpm exec commitlint
```

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, ESLint, Prettier, Commitlint, Husky, lint-staged.

## Coach MVP (mock data)

The home route is a **coach dashboard** (BETTER design language: Poppins, brand colors, squarcle cards). Batch / group selectors, KPI tiles, 7-day log-rate chart (Recharts), and a roster with WhatsApp deep links use **mock data** in `src/lib/coach/` until a real API exists.
