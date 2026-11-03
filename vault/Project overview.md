# Project overview

A Telegram bot that tells you the five daily prayer times and messages you when one begins. Times come from AlAdhan (Muslim World League method, `method=3`).

It started as a Python bot with SQLite, Postgres, a Gemini `/ask` command and a Qibla web page. In October 2026 it was restarted from scratch in JavaScript on Telegram's serverless platform. The old code is not in the repo any more. The Qibla page and the AlAdhan logic can still be recovered from the old git history by commit hash, if that history survives anywhere.

## Two parts

- The bot, in `tgcloud/`, runs on Telegram's serverless platform. It answers commands and button taps.
- The reminder Worker, in `reminder-worker/`, runs on Cloudflare with a cron trigger every minute. It sends the reminders. See [[Architecture]] for why it has to be separate.

## How the work is done

The owner writes the code. An AI assistant acts as a tutor: it gives hints, reviews files, runs read-only checks, and explains errors. The assistant does not run git commands that change the repo, so commits and pushes are done by the owner. See [[Gotchas]] for the traps found along the way.

## State on 2026-11-03

- Command router with `/start`, `/setlocation`, `/reminderon`, `/reminderoff`, and a registered `/` command menu.
- `tgcloud/lib` was restructured into folders by purpose, and settings reads go through `getConfig`.
- Location picker from continent to country, then a typed city search that saves the choice.
- Reminders run for one person, from fixed settings in the Worker. They do not use the saved location yet.
- Next steps are in [[Roadmap]].
