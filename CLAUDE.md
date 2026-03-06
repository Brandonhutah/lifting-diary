# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is a **Next.js 15** app using the **App Router** with **React 19**, **TypeScript** (strict mode), and **Tailwind CSS v4**.

- `app/` — All routes and layouts. Server Components by default; add `"use client"` directive when client-side interactivity is needed.
- `app/layout.tsx` — Root layout: fonts (Geist/Geist Mono via `next/font/google`), global metadata, and `globals.css`.
- `app/globals.css` — Imports Tailwind via `@import "tailwindcss"` (Tailwind v4 syntax) and defines CSS variables for theming (`--background`, `--foreground`) with automatic dark mode via `prefers-color-scheme`.
- `public/` — Static assets served at the root path.

**Path alias:** `@/*` maps to the project root (e.g., `@/app/components/Foo`).

**No test framework is configured yet.**
