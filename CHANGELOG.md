# Changelog

Newest day first. The README describes the current state; this file records how it got there.

## 2026-10-30

- Added `/reminderon` and `/reminderoff`.
- The bot now calls the Worker over HTTPS with a shared secret in the `x-secret` header. The Worker checks the secret and the chat id, then stores `on` or `off` in KV. The cron skips sending while the flag is `off`.
- Added a `fetch` handler to the Worker. It accepts only `POST` and answers 401, 403 or 400 for a bad secret, a wrong chat id or a bad body. This needed the `workers.dev` address switched back on.
- Added `tgcloud/lib/worker.js`. The Worker's address and the shared secret are stored as rows in the bot's `config` table.

## 2026-10-26

- Deployed the Cloudflare Worker with a cron trigger every minute. The first real reminder arrived at 11:44, the Dhuhr time for Phnom Penh.
- Replaced the per-run lookup with a month of prayer times cached in Workers KV for 40 days. The time zone now comes from a `TIMEZONE` setting.
- Built the location picker with inline buttons: continent, then region, then a paged country list. Each tap edits the same message. A Back button returns to the page the user came from.
- Added `handlers/callback_query.js` and a screen table that maps each button type to its text and keyboard.
- Added `scripts/gen-countries.mjs`, which builds `tgcloud/lib/countries.js` with 247 countries, each with a region and subregion. Antarctica and two uninhabited islands are left out.
- Moved commands into `tgcloud/lib/commands.js` as a lookup table. An unknown command gets an error reply, and plain text gets a hint.
- Removed the share-location button. The bot no longer asks for exact coordinates.
- Added the README and this changelog.

## 2026-10-25

- Restarted the project in JavaScript on Telegram's serverless platform. The earlier Python version is gone from the repository, and `main` was replaced with a fresh history.
- Deployed an echo bot and confirmed the webhook matched the deployed handlers.
- Added the `config` table and a prayer time lookup against AlAdhan. The API address is read from the database.
- Added `to12hour` for AM and PM times, and a reply that sends the five times for a shared location.
