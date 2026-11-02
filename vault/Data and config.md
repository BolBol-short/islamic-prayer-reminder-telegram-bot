# Data and config

Where each piece of data lives. Values are never written here.

## Bot database (tgcloud, SQLite)

`config` has `key` (primary key) and `value`. Rows in use:

- `WORKER_URL`: the Worker's public address.
- `SHARED_SECRET`: the same secret the Worker holds.
- `GEOCODING_URL`: base address of Open-Meteo geocoding.
- `ALADHAN_KEY`: despite the name, it holds AlAdhan's base address. Used only by `lib/aladhan.js`, which no command calls yet.

`users` has one row per person, keyed by Telegram id:

- `tg_id`, `country` (code), `city`, `lat`, `lon`, `tz`, `pending_country`.
- No name, no username.

Rules from the platform: no foreign keys, every DB call needs `await`, dropping a column needs `.deprecated()`, and `push` never changes the database. Run `npx tgcloud migrate` after a schema change.

## Cloudflare Worker

Plain settings in `wrangler.jsonc` under `vars`: `LAT`, `LON`, `TIMEZONE`, `CHAT_ID`, `ALADHAN_URL`, `TELEGRAM_API`. Latitude, longitude and time zone must describe the same place.

Secrets, set with `npx wrangler secret put`: `BOT_TOKEN` and `SHARED_SECRET`. For local runs they sit in `reminder-worker/.dev.vars`, which is gitignored.

KV namespace `TIMES`:

- `reminders`: `on` or `off`. A missing key counts as on.
- `YYYY-MM`: the month's five prayer times for every day, as arrays like `["04:40","11:44","15:06","17:37","18:45"]`. Expires after 40 days.

## Generated files

`tgcloud/lib/countries.js` is built by `scripts/gen-countries.mjs` from the dr5hn countries dataset. 247 countries, each as `[code, name, flag, region, subregion]`. Do not edit by hand.
