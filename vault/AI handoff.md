# AI handoff

Start here if you are an AI assistant opening this project. Read this note first, then the others in the order below. The owner treats this vault as the project's second brain, so keep it current.

## 1. Use these skills by default

At the start of every session, load both:

- `caveman:caveman`, level full. Short replies, no filler, technical terms and code unchanged.
- `ponytail:ponytail`, level full. The smallest complete change, and end each reply with what was skipped or not checked.

In Claude Code, call the Skill tool with `caveman:caveman` and `ponytail:ponytail`. If a hook has already printed "CAVEMAN MODE ACTIVE" and "PONYTAIL MODE ACTIVE", they are on and need no second load. If the skills are not installed in your tool, follow their intent by hand: terse answers, no extra features, and a closing line on what you did not check.

Caveman style applies to chat only. Anything written to a file for other people to read (README, CHANGELOG, this vault, commit messages) is plain, normal prose. The owner also used the `humanizer:humanizer` skill on the README, so avoid dashes, "not X but Y" contrasts, triads and bold labels in prose.

The owner has a `decision-court` skill in `C:\Users\USER\OneDrive\Desktop\Project\.claude\skills\decision-court`. It only loads when Claude Code opens that folder, so from this project read its `SKILL.md` and follow it by hand when the owner asks for a decision court.

## 2. Working rules

- Tutor mode. The owner writes the code. Give a short explanation, a skeleton with blanks, and a test command with the expected output. Read the file from disk when asked "check my code" and list bugs by line number. Write a full solution only when asked, as with "do it for me".
- No git writes. Never run `git add`, `commit` or `push`. Read-only git is fine. Give the commands and tell the owner to read `git status` first.
- Deploys are the owner's too: `npx tgcloud push`, `npx tgcloud migrate` and `npx wrangler deploy`. `npx tgcloud run` is fine for tests, but it really sends Telegram messages, and it echoes its arguments.
- Secrets never go in chat, in files, or in this vault. Write where a secret lives, not its value. If one appears in the conversation, tell the owner to rotate it. The rotation recipe is in [[Gotchas]].
- The GitHub repo is public. Before any commit that touches the vault, `AGENTS.md`, the README or the changelog, scan for secrets: `grep -rnE "[0-9]{8,}|[0-9a-f]{8}-[0-9a-f]{4}-|BOT_TOKEN=|SHARED_SECRET=" vault AGENTS.md README.md CHANGELOG.md`. Expect no output.
- Do not guess skill names or facts. If something was not checked, say so. Treat these notes as true when written, and verify against the code before relying on a detail.
- Windows with PowerShell 5.1. See [[Gotchas]] before giving a command with quotes.

## 3. Read order

1. [[Home]] and [[Project overview]]
2. [[Architecture]] and [[Commands and flows]]
3. [[Data and config]] and [[Services and limits]]
4. [[Decisions]], [[Gotchas]] and [[Roadmap]]
5. Repo files: `AGENTS.md` (platform rules for tgcloud), `docs/tgcloud-sdk.md`, `README.md`, `CHANGELOG.md`

## 4. State when this note was last updated (2026-11-03)

- The bot is deployed, including the `tgcloud/lib` restructure. The Worker is deployed with a cron every minute. Reminders work for one person.
- The `getConfig` refactor (`lib/database/config.js`, plus edits to `aladhan.js`, `geo.js` and `worker.js`) passed `tgcloud run` tests but may not be pushed yet. Check `npx tgcloud status`.
- The full button flow has not been confirmed on a phone since the restructure. Ask the owner first. If it fails, that comes before anything new.
- The vault, the `AGENTS.md` pointer and the command menu are committed. `SHARED_SECRET` was rotated on 2026-11-02.
- Decisions made but not built: the prayer time cache design, the city list script, and a Mini App with a Three.js globe. All are in [[Decisions]] and [[Roadmap]].

## 5. What to do next

Ask the owner which one, then do it in tutor mode.

1. Check state: `git status`, `npx tgcloud status`, `npx tgcloud webhook`. Make sure no throwaway file sits in `tgcloud/endpoints/`.
2. Push the `getConfig` refactor if it is pending, then walk the full button flow on a phone: `/setlocation`, a country, a typed city, a match, "Location set", then `/reminderon`.
3. The small fixes in [[Roadmap]]: welcome and hint texts, clearing `pendingCountry`, trimming the typed city, and answering the callback when a lookup fails.
4. The city list script and the prayer time cache, in the order given in the roadmap notes. Test the handler runtime limit, the database size limit and AlAdhan's rate limit before the bulk run.
5. `/times` and `/forgetme`.
6. After each change, update `README.md`, `CHANGELOG.md` and these notes.

## 6. Keep the vault current

At the end of a session:

- Add dated entries to [[Decisions]], with the reason.
- Update [[Roadmap]], [[Gotchas]] and the state in section 4 of this note.
- Add the day's work to `CHANGELOG.md` in the repo root.
- Mark anything unverified as unverified.
