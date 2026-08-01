<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- The runnable app lives in the `web/` subdirectory (the repo root has no `package.json`). Run all `npm` commands from `web/`. Package manager is npm (`web/package-lock.json`). Standard scripts are in `web/package.json`: `npm run dev` (Next dev server, port 3000), `npm run build`, `npm run start`, `npm run lint`.
- Required environment variables (see `web/lib/supabase.ts` and `web/app/api/generate/route.ts`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`. Provide them via Cursor Secrets (injected as process env, which Next uses directly) or a gitignored `web/.env.local`.
- Gotcha: `web/lib/supabase.ts` `throw`s at import time if the two `NEXT_PUBLIC_SUPABASE_*` vars are missing. Because that module is imported by the landing page (waitlist form) and `/dashboard`, no page will render without them — placeholder values are enough to boot and render the UI. `web/.env.local` is gitignored, so it is not committed and must be recreated on fresh VMs if real secrets are not set as env vars.
- Full end-to-end behavior needs real external services: a Supabase project with a `waitlist` table (unique `email`), a `scripts` table (`user_id`, `topic`, `audience`, `video_length`, `content`), and anonymous auth enabled; plus a valid Google `GEMINI_API_KEY` (model `gemini-3.6-flash`). With placeholder credentials the app boots and is fully interactive, but anonymous sign-in, waitlist insert, save-script, and script generation fail (expected).
- The `openai` package is a dependency but is unused; the AI provider in use is Google Gemini (`@google/genai`).
