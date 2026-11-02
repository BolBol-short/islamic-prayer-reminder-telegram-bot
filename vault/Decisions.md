# Decisions

Newest first. Each entry says what was chosen and why.

## 2026-11-02

- Keep a vault of notes in `vault/`, next to the code but outside `tgcloud/`, so it is never deployed. No secrets go in it.
- Court ruling on whether `vault/` goes into the public GitHub repo: approved with conditions, 84 to 78 over keeping it local, medium confidence. The owner has not decided yet. Conditions: rotate `SHARED_SECRET` first, reword the notes that mention the leak, scan the vault before every commit, never write real addresses or ids in it. Reverse the ruling if real addresses or ids start going into the notes. The repo was verified public on 2026-11-02.

## 2026-10-31

- Find cities by typed search first. It covers every country on day one, and each result brings coordinates and a time zone from Open-Meteo.
- Store the time zone per city, never per country. Countries such as the USA, Russia and Indonesia span several zones.
- Store the city's coordinates, not the user's. The only user key is the Telegram id, with no name or username.
- Plan city buttons next: capitals resolved by a script plus a few hand-picked cities per country, with typing as a fallback.

## 2026-10-30

- Reminders on and off live in Worker KV, and the bot reaches the Worker with a POST and a shared secret. This needed the `workers.dev` address switched back on, with the secret and a chat id check as protection.
- The commands are `/reminderon` and `/reminderoff`, lowercase, because the router lowercases input.

## 2026-10-26

- Reminders run in a Cloudflare Worker, because the serverless platform has no timers.
- Cache a whole month of prayer times in KV instead of calling AlAdhan every minute. KV allows 1,000 writes a day, and this uses about one a month.
- Build the picker as one message edited in place. Callback data stays stateless, and Back targets are computed from the data.
- Start the picker at continents, then regions, then countries, because a flat alphabetical list of 247 countries took too many taps.
- Drop the share-location button. The bot should not ask for exact positions.
- Move commands into a table in `lib/commands.js`, and button screens into a table in `callback_query.js`.

## 2026-10-25

- Rewrite in JavaScript on Telegram's serverless platform. Drop the Python code, Supabase, Vercel and the Gemini key.
- Keep AlAdhan as the source of prayer times. Store its base address in the database instead of the code.
- Replace the old GitHub history with a fresh `main`, without keeping a backup.
