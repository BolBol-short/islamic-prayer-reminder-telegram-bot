# Roadmap

## Next

- City buttons. A script `scripts/gen-cities.mjs` resolves each country's capital through Open-Meteo, plus a small table of extra cities by name for chosen countries, and writes `tgcloud/lib/cities.js` with name, coordinates and zone. Country tap shows those buttons with "Other city: type it" as a fallback. Button picks need no network call.
- Prayer time cache for every country and city, fetched for the day, the month and the year. See the notes below.
- A command that shows today's times for the saved city.
- A command that deletes the user's row.

## Later

- Reminders that use each person's saved location. The Worker needs the users, which means moving off a fixed chat id. KV list calls are too limited for a scan every minute, so D1 is the likely store. The bot would send the location and time zone to the Worker when a user saves or changes it.
- A record of sent reminders, so a skipped cron minute does not lose one.
- Expire `pendingCountry`.
- Qibla page, and the `/ask` command, if wanted again.

## Notes on the cache idea

The goal is to fetch prayer times for every country and its cities at day, month and year level.

- AlAdhan has a yearly calendar endpoint. Not tested yet. If it works, one year per city holds the month and the day too, so a yearly fetch covers all three levels and the smaller ones are only slices.
- Size: five times of five characters for 365 days is about 9 KB per city per year before overhead. A few hundred cities fit in the bot's database or KV.
- Open questions: where it lives (bot database, Worker KV, or both), who fills it (a script, a Worker cron, or on first use), AlAdhan's rate limits, and whether to prefetch all cities or only the ones users pick.
