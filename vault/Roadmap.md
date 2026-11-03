# Roadmap

## Next, in order

1. Deploy and test what is only local. The `getConfig` refactor (`lib/database/config.js`) passed `tgcloud run` tests but is not pushed. After the push, walk the whole button flow on a phone, because the folder restructure moved every import.
2. Small fixes in the current bot:
   - The `/start` text says "Hi lol" and names only `/setlocation`. The hint does the same. Both should name all four commands.
   - Clear `pendingCountry` when `/setlocation` starts, so old state does not turn chat text into a city search.
   - Trim and cap the typed city text, and reject one-character searches.
   - If `getPlace` fails on a button tap, answer the callback with a short error. Today the handler throws and the button spins.
   - Optional: build `commands` and `menu` from one table, guard `msg.from?.id`, and rename the `ALADHAN_KEY` row, which holds an address.
3. Update the README, changelog and these notes after each change.
4. City list and prayer time cache, described below.
5. `/times`, which shows all prayer times for the saved location, and `/forgetme`, which deletes the user's row.

## Later

- Reminders that use each person's saved location. The Worker needs the users, so it must stop relying on one fixed chat id. KV list calls are too limited for a scan every minute, so D1 is the likely store. The bot would send the location and time zone to the Worker when a user saves or changes it.
- A record of sent reminders, so a skipped cron minute does not lose one.
- A Mini App for choosing a location, with a Three.js globe.
- Qibla page and the `/ask` command, if wanted again.

## Notes on the city list

- `scripts/gen-cities.mjs` would take each country's capital from the countries dataset (the part before any comma), add a small table of extra cities by name, search each in Open-Meteo with `countryCode`, prefer a result with `feature_code` `PPLC`, and write `tgcloud/lib/data/cities.js` as `{ KH: [[name, lat, lon, tz], ...] }` with coordinates rounded to four decimals.
- The script prints every match so a person can review it, and waits about 150 ms between searches. A search that finds nothing is skipped and listed.
- A Cambodia-only picker was sketched: 25 province buttons, where the label is the province and the coordinates are its capital town's, saved on tap with no network call. It was postponed. The full picker stays for now.

## Notes on the prayer time cache

- It lives in the bot's database, in a table such as `times_cache` with `key` (primary key), `value` (JSON text) and `fetchedAt`.
- Lookup order: year, then month, then day, then a live AlAdhan call. Day and month are filled lazily when a user needs them.
- Key shape: coordinates at four decimals plus the period, for example `y:11.5624,104.9160:2026`, `m:...:2026-11`, `d:...:2026-11-03`. Call AlAdhan with the rounded coordinates so the key and the data match.
- The yearly tier is a bulk job over every city in `cities.js`. The bot's database can only be written by the bot's own code, so a local script drives `npx tgcloud run endpoints/<name>` in small batches with a pause between calls. A batch skips cities that already have a row, so a failed run can start again where it stopped. Rerun it each December for the next year.
- Size and time, as estimates: about 15 KB per city per year, so roughly 4.5 MB and 13 minutes of sequential calls for 300 cities.
- Not checked yet: how long one handler may run, the database size limit, and AlAdhan's rate limit. A small test should settle them before the bulk run.
- Measured call times and sizes are in [[Services and limits]].

## Notes on the Mini App

- The platform deploys a front-end build folder named in `tgcloud.jsonc` under `static.source`. The page talks to the bot only through endpoints, and neither side can import the other's files.
- Sketch: `/setlocation` sends a `web_app` button. The page loads the city list from an endpoint `cities`, so there is one source of truth. It saves through an endpoint `setLocation`, which gets the caller from verified init data.
- The endpoint takes a city id from the known list. It never accepts raw coordinates from the page.
- A Three.js globe could be an earth texture plus pins placed from latitude and longitude, with a raycast for taps. Keep a plain list beside it, because a globe is hard to tap precisely and invisible to screen readers. Not tested yet in Telegram's mobile web views.
- Build the buttons first, then the Mini App on the same data.
