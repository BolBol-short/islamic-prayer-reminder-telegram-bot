# AI handoff

Start here if you are an AI assistant opening this project. Read this note first, then the others in the order below. The owner treats this vault as the project's second brain, so keep it current.

## 1. Use these skills by default

At the start of every session, load both:

- `caveman:caveman`, level full. Short replies, no filler, technical terms and code unchanged.
- `ponytail:ponytail`, level full. The smallest complete change, and end each reply with what was skipped or not checked.

In Claude Code, call the Skill tool with `caveman:caveman` and `ponytail:ponytail`. If a hook has already printed "CAVEMAN MODE ACTIVE" and "PONYTAIL MODE ACTIVE", they are on and need no second load. If the skills are not installed in your tool, follow their intent by hand: terse answers, no extra features, and a closing line on what you did not check.

Caveman style applies to chat only. Anything written to a file for other people to read (README, CHANGELOG, this vault, commit messages) is plain, normal prose. The owner also used the `humanizer:humanizer` skill on the README, so avoid dashes, "not X but Y" contrasts, triads and bold labels in prose.

## 2. Working rules

- Tutor mode. The owner writes the code. Give a short explanation, a skeleton with blanks, and a test command with the expected output. Read the file from disk when asked "check my code" and list bugs by line number. Write a full solution only when asked.
- No git writes. Never run `git add`, `commit` or `push`. Read-only git is fine. Give the commands and tell the owner to read `git status` first.
- Deploys are the owner's too: `npx tgcloud push`, `npx tgcloud migrate` and `npx wrangler deploy`. `npx tgcloud run` is fine for tests, but it really sends Telegram messages.
- Secrets never go in chat, in files, or in this vault. Write where a secret lives, not its value. If one appears in the conversation, tell the owner to rotate it.
- Do not guess skill names or facts. If something was not checked, say so. Treat these notes as true when written, and verify against the code before relying on a detail.
- Windows with PowerShell 5.1. See [[Gotchas]] before giving a command with quotes.

## 3. Read order

1. [[Home]] and [[Project overview]]
2. [[Architecture]] and [[Commands and flows]]
3. [[Data and config]] and [[Services and limits]]
4. [[Decisions]], [[Gotchas]] and [[Roadmap]]
5. Repo files: `AGENTS.md` (platform rules for tgcloud), `docs/tgcloud-sdk.md`, `README.md`, `CHANGELOG.md`

## 4. State when this note was last updated (2026-11-02)

- The bot is deployed. The Worker is deployed with a cron every minute. Reminders work for one person.
- The city step by typed search is deployed, but the owner never confirmed the full flow on a phone. Ask first. If it fails, that comes before anything new.
- The vault itself is new. Whether `vault/` goes into the git repo is the owner's call and still open. The court recommended yes, with conditions, in [[Decisions]]. The GitHub repo is public.
- `SHARED_SECRET` was rotated on 2026-11-02, and the new value never appeared in a chat.

## 5. What to do next

Ask the owner which one, then do it in tutor mode.

1. Check state: `git status`, `npx tgcloud status`, `npx tgcloud webhook`. Make sure no throwaway file sits in `tgcloud/endpoints/`.
2. Confirm the city step on a phone: `/setlocation`, a country, a typed city, a match, "Location set".
3. City buttons. Write `scripts/gen-cities.mjs`: it resolves each country's capital through Open-Meteo, adds a small hand-picked list of extra cities by name, and writes `tgcloud/lib/cities.js` with name, coordinates and time zone. Then add city buttons to the country screen with "Other city: type it" as the fallback. Details in [[Roadmap]].
4. Prayer time cache for every country and city, at day, month and year level. First test AlAdhan's yearly calendar endpoint, then decide where it lives (bot database or Worker KV) and who fills it. A yearly fetch per city contains the month and the day.
5. Smaller items: `/times` and `/forgetme`.

## 6. Keep the vault current

At the end of a session:

- Add dated entries to [[Decisions]], with the reason.
- Update [[Roadmap]], [[Gotchas]] and the state in section 4 of this note.
- Add the day's work to `CHANGELOG.md` in the repo root.
- Mark anything unverified as unverified.
