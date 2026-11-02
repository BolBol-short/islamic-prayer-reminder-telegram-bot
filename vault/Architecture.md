# Architecture

```
You ── /reminderoff ──> bot (tgcloud) ── POST + x-secret ──> Worker ──> KV "reminders"
                                                              │
                                           cron, every minute ┘ ── Bot API sendMessage ──> You
```

## Why two parts

Telegram's serverless platform runs a handler only when an update arrives. A test showed that `setTimeout` and `setInterval` do not exist there, and the only globals are `TextEncoder`, `TextDecoder` and `crypto`. The CLI package and the docs have no mention of cron or scheduling either. So the bot cannot wake itself up at a prayer time, and a Cloudflare Worker with a cron trigger does that job. See [[Decisions]].

## The bot (`tgcloud/`)

- `handlers/message.js` passes every text message to `lib/commands.js`.
- `handlers/callback_query.js` handles taps on inline buttons by looking up a screen in a table and editing the message.
- `lib/` holds commands, keyboards, the generated country list, user storage, city search, prayer time lookup, and the call to the Worker.
- Everything under `tgcloud/` is deployed with `npx tgcloud push`. Nothing outside it is.

## The Worker (`reminder-worker/src/index.js`)

- `scheduled()` runs every minute. It skips if the KV key `reminders` is `off`. Otherwise it reads the current time in the configured zone, loads the month's times from KV (fetching them from AlAdhan on a miss), and sends a message when a prayer time equals the current minute.
- `fetch()` accepts `POST` only. It checks the `x-secret` header, then the chat id, then writes `on` or `off` to KV.

## Reminder toggle, step by step

1. The user sends `/reminderoff`.
2. The bot reads `WORKER_URL` and `SHARED_SECRET` from its `config` table.
3. The bot POSTs `{ chat_id, on }` to the Worker with the secret in a header.
4. The Worker answers 401 for a bad secret, 403 for a wrong chat id, 400 for a bad body, and 200 after writing KV.
5. The bot tells the user "Reminder Off" or an error line.

## Known weak spots

- No record of sent reminders. A skipped cron minute loses that reminder.
- The Worker serves one chat. Many users need a different design, see [[Roadmap]].
