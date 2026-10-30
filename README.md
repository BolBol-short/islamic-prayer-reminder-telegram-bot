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
| `/setlocation` | Opens a picker: continent, region, then country. The city step is not built yet, so nothing is saved |
| `/reminderon` | Turns prayer reminders on |
| `/reminderoff` | Turns prayer reminders off |

Command names are matched in lowercase, so `/reminderOn` works too. Any other text gets a short hint.

## How the reminders work

Every minute the Worker reads the current time in its configured time zone and compares it with the day's five prayer times. On a match, it sends a message through the Bot API.

The Worker fetches a whole month of times from AlAdhan once and keeps it in Workers KV for 40 days, so it does not call the API every minute. If the fetch fails, the key stays empty and the next minute tries again.

`/reminderon` and `/reminderoff` make the bot call the Worker over HTTPS. The request carries a shared secret in the `x-secret` header. The Worker also checks that the chat id matches the one it serves, then writes `on` or `off` to KV. While the flag is `off`, the cron does nothing.

## Project layout

```
tgcloud/
  schema.js            database tables (currently one: config)
  handlers/
    message.js         routes text messages to lib/commands.js
    callback_query.js  handles button taps in the location picker
  lib/
    commands.js        command table: /start, /setlocation, /reminderon, /reminderoff
    keyboards.js       continent, region and country button layouts
    countries.js       generated list of 247 countries (do not edit by hand)
    worker.js          calls the Worker to switch reminders on or off
    aladhan.js         prayer time lookup by coordinates, unused until the city step
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

`push` uploads the code. `migrate` creates the `config` table. The two steps are separate on purpose, because deploying never touches the database.

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

The bot needs the Worker's address and the shared secret. Both go into the bot's `config` table as rows named `WORKER_URL` and `SHARED_SECRET`. Insert them once with a short throwaway endpoint run through `npx tgcloud run`, then delete that file. Do not commit it, since it holds the secret.

## Secrets

Nothing secret is stored in git. The bot token and the shared secret live as Worker secrets, in the gitignored `.dev.vars` for local runs, and in the bot's database for the bot's copy of the shared secret. The Worker's public address is protected by the secret header, and it only accepts `POST`.

## Known limits

- Reminders serve one person for now. The chat id and location are fixed in `wrangler.jsonc`.
- The Worker keeps no record of what it already sent. If Cloudflare skips a cron minute, that reminder is lost.
- Cloudflare's free plan allows about 50 outgoing requests per cron run, which caps messages per minute once there are many users.
- Prayer times come from coordinates, so the time zone in `wrangler.jsonc` has to match them.

## Status

- [x] Bot deployed with a command router
- [x] Reminders sent by a Worker cron, with a monthly cache
- [x] Location picker down to the country
- [x] `/reminderon` and `/reminderoff`
- [ ] City step and saved location per user
- [ ] Reminders for more than one user

The day-by-day history is in [CHANGELOG.md](CHANGELOG.md).
