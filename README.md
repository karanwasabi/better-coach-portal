# better-coach-portal

Coach-facing web app (Next.js).

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** (`corepack enable` or [pnpm.io](https://pnpm.io/installation))

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

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced via Husky in a later setup). Check a message locally:

```bash
echo "feat: example change" | pnpm exec commitlint
```

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, ESLint, Prettier, Commitlint.
