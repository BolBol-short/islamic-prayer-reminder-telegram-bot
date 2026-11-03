# Services and limits

Facts checked during the build. Limits and prices change, so recheck before relying on them.

## Telegram serverless (tgcloud)

- Only `.js` files under `tgcloud/` are deployed: `schema.js`, `lib/`, `handlers/`, `endpoints/`.
- No timers, no filesystem, no npm packages, and no documented environment variables or secrets store.
- Relative imports must end in `.js`. The SDK is imported by name: `sdk` and `sdk/db`.
- `npx tgcloud run` only runs modules in `handlers/` and `endpoints/`.
- A handler gets the update's payload: the message for `message`, the callback query for `callback_query`.
- Allowed updates follow the deployed handlers. Adding `handlers/callback_query.js` made the webhook accept `callback_query`.

## AlAdhan

- `calendar/{year}/{month}?latitude&longitude&method=3` returns a whole month. Times look like `04:40 (+07)`, so cut the first five characters.
- `timings?latitude&longitude&method=3` returns one day. The response includes `meta.timezone`.
- `timingsByCity` uses a geocoder. A nonsense city gives 400. A city that does not match its country gave 503 with a misleading "geocoding unavailable" message. A country alone is rejected.
- `curl` needs `-L`, because the API redirects. `fetch` in the runtimes used here follows redirects.
- `calendar/{year}?latitude&longitude&method=3` returns a whole year. `data` is an object keyed `1` to `12`, and each value is an array of that month's days. Cut to the five prayers it is about 15 KB per location.
- Measured on 2026-11-02 for Phnom Penh, two runs each: one day took 0.8 to 1.0 s (1.2 KB), one month 1.5 to 4.6 s (39 KB), one year about 2.6 s (469 KB). The month timing was noisy.
- No API key, and no rate limit was found in the docs I fetched. This is not confirmed.

## Open-Meteo geocoding

- `search?name&count&language&countryCode` returns matches with `id`, `name`, `admin1`, `country`, `country_code`, `latitude`, `longitude`, `timezone` and `population`.
- `get?id=` returns one place by id.
- Capitals carry `feature_code` `PPLC` and provincial capitals `PPLA`, so a search can prefer them. When 25 Cambodian provincial capital towns were searched, 22 matched on the first try. `Krong Khemarak Phoumin` found nothing, and `Doun Kaev` matched a place in the wrong province. Always review the matches a script picks.
- Of the 247 countries in use, 245 have a capital in the countries dataset. Only `Douglas, Isle of Man` has a comma in its capital name.
- No key. The free tier is for non-commercial use, which I did not verify in its terms.

## Cloudflare (free plan, checked 2026-10-26)

- Workers: 100,000 requests a day, 10 ms CPU per invocation, 50 subrequests per invocation, 5 cron triggers per account.
- KV: 100,000 reads, 1,000 writes and 1,000 list calls a day. A list call every minute would exceed the list limit, which rules KV out for scanning many users.
- D1: 5 GB, 5 million rows read and 100,000 rows written a day.
- The paid plan starts at $5 a month.

## Country data

- `dr5hn/countries-states-cities-database`, `json/countries.json`: 250 countries with region, subregion, emoji, capital and a list of time zones. 215 of 247 used countries have exactly one zone.
- `restcountries.com` v3.1 answers that the API version is deprecated.
