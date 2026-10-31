# Bolbol prayer reminder bot

A Telegram bot that tells you the five daily prayer times and sends a message when one begins. Prayer times come from the [AlAdhan API](https://aladhan.com/prayer-times-api), using the Muslim World League method.

The bot has two parts, because Telegram's serverless platform can answer messages but cannot run anything on a timer.

- `tgcloud/` is the bot itself. It runs on Telegram's serverless platform and handles commands and buttons.
- `reminder-worker/` is a Cloudflare Worker with a cron trigger that runs every minute. It sends the reminders.

```
You ── /reminderoff ──> bot (tgcloud) ── POST + secret ──> Worker ──> KV flag "reminders"
                                                            │
                                         cron, every minute ┘ ── Telegram Bot API ──> You
```

## Commands

| Command | What it does |
|---|---|
| `/start` | Short welcome message |
| `/setlocation` | Walks you from continent to region to country, then asks you to type a city and saves your choice |
| `/reminderon` | Turns prayer reminders on |
| `/reminderoff` | Turns prayer reminders off |

Command names are matched in lowercase, so `/reminderOn` works too. An unknown command gets an error reply, and any other text gets a short hint.

## Setting your location

`/setlocation` sends one message and edits it as you tap. A Back button returns you to the page you came from.

1. Pick a continent, then a region such as South-Eastern Asia, then a country from a paged list.
2. The bot asks you to type a city name. It searches [Open-Meteo's geocoding API](https://open-meteo.com/en/docs/geocoding-api) inside that country and shows up to five matches, each with its region so that places with the same name can be told apart.
3. Tap a match. The message changes to "Location set" and the buttons disappear.

The bot never asks for your exact position. It stores the coordinates of the city you picked, not where you are.

## How the reminders work

Every minute the Worker reads the current time in its configured time zone and compares it with the day's five prayer times. On a match, it sends a message through the Bot API.

The Worker fetches a whole month of times from AlAdhan once and keeps it in Workers KV for 40 days, so it does not call the API every minute. If the fetch fails, the key stays empty and the next minute tries again.

`/reminderon` and `/reminderoff` make the bot call the Worker over HTTPS. The request carries a shared secret in the `x-secret` header. The Worker also checks that the chat id matches the one it serves, then writes `on` or `off` to KV. While the flag is `off`, the cron does nothing.

The Worker does not use your saved location yet. It still reads one fixed place from `wrangler.jsonc`.

## What the bot stores

The bot's database has two tables.

- `config` holds settings as key and value rows: the Worker's address, the shared secret, and the address of the geocoding API.
- `users` holds one row per person, keyed by Telegram id: country code, city name, the city's coordinates, its time zone, and the country you are in the middle of choosing. It stores no name and no username.

## Project layout

```
tgcloud/
  schema.js            database tables: config and users
  handlers/
    message.js         routes text messages to lib/commands.js
    callback_query.js  handles button taps and edits the picker message
  lib/
    commands.js        command table, plus the city search for plain text
    keyboards.js       button layouts for continents, regions, countries and city matches
    countries.js       generated list of 247 countries (do not edit by hand)
    users.js           reads and saves a user's row
    geo.js             city search and place lookup against Open-Meteo
    worker.js          calls the Worker to switch reminders on or off
    aladhan.js         prayer time lookup by coordinates, not called by any command yet
    time.js            24-hour to 12-hour conversion
reminder-worker/
  src/index.js         cron job (scheduled) and the on/off endpoint (fetch)
  wrangler.jsonc       cron schedule, KV binding, non-secret settings
scripts/
  gen-countries.mjs    builds tgcloud/lib/countries.js from a public dataset
```

## Setup

You need Node 18 or newer, a Telegram bot with Serverless CLI access (from @BotFather), and a free Cloudflare account.

### The bot

```
npm install
npx tgcloud login
npx tgcloud push
npx tgcloud migrate
```

`push` uploads the code. `migrate` creates the tables. The two steps are separate on purpose, because deploying never touches the database.

### The Worker

```
cd reminder-worker
npm install
npx wrangler login
npx wrangler kv namespace create TIMES
```

Put the printed namespace id in `wrangler.jsonc` under `kv_namespaces`. In the same file, set these under `vars`: `LAT`, `LON`, `TIMEZONE` (an IANA name such as `Asia/Phnom_Penh`), `CHAT_ID`, `ALADHAN_URL` and `TELEGRAM_API`. Latitude, longitude and time zone must describe the same place.

Then add the two secrets and deploy:

```
npx wrangler secret put BOT_TOKEN
npx wrangler secret put SHARED_SECRET
npx wrangler deploy
```

For local runs, put the same two values in `reminder-worker/.dev.vars`, then run `npx wrangler dev --test-scheduled` and open `/__scheduled` to trigger the cron by hand.

### Connecting the two

The bot needs three rows in its `config` table: `WORKER_URL` (the Worker's address), `SHARED_SECRET` (the same value as the Worker's secret) and `GEOCODING_URL` (`https://geocoding-api.open-meteo.com/v1`). Insert them once with a short throwaway endpoint run through `npx tgcloud run`, then delete that file. Do not commit it if it contains the secret.

## Secrets

Nothing secret is stored in git. The bot token and the shared secret live as Worker secrets, in the gitignored `.dev.vars` for local runs, and in the bot's database for the bot's copy of the shared secret. The Worker's public address is protected by the secret header, and it only accepts `POST`.

## Known limits

- Reminders serve one person for now. The chat id and location are fixed in `wrangler.jsonc`, so a saved location does not change when reminders fire.
- The Worker keeps no record of what it already sent. If Cloudflare skips a cron minute, that reminder is lost.
- Cloudflare's free plan allows about 50 outgoing requests per cron run, which caps messages per minute once there are many users.
- Prayer times come from coordinates, so the time zone in `wrangler.jsonc` has to match them.
- The country you are choosing is remembered until you pick a city. If you walk away and send other text later, the bot reads it as a city name. Commands still work.
- The city search relies on Open-Meteo, whose free tier is meant for non-commercial use.

## Status

- [x] Bot deployed with a command router
- [x] Reminders sent by a Worker cron, with a monthly cache
- [x] Location picker from continent to country
- [x] City step by typed search, with the choice saved
- [x] `/reminderon` and `/reminderoff`
- [ ] City buttons for common cities, so typing is only a fallback
- [ ] A command that shows today's times for the saved city
- [ ] A command to delete your saved data
- [ ] Reminders that use each person's saved location

The day-by-day history is in [CHANGELOG.md](CHANGELOG.md).
