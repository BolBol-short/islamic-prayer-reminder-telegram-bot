# Commands and flows

## Commands

| Command | Behavior |
|---|---|
| `/start` | Welcome text |
| `/setlocation` | Starts the location picker |
| `/reminderon` | Turns reminders on through the Worker |
| `/reminderoff` | Turns reminders off through the Worker |
| other `/command` | "Unknown cmd" reply |
| other text | City search if a country is pending, otherwise a hint |

The router takes the first word of the message, drops any `@botname` suffix and lowercases it, so table keys must be lowercase.

## Location picker

One message that gets edited on every tap.

1. Continents, then regions (subregions) of that continent, then a paged list of countries, eight per page.
2. Tapping a country saves it as `pendingCountry` and asks the user to type a city.
3. The next plain text is searched in Open-Meteo inside that country. Up to five matches come back as buttons, labeled with name and region.
4. Tapping a match saves country, city, coordinates and time zone, clears `pendingCountry`, and replaces the message with "Location set".

## Callback data

Short strings, always under 64 bytes, and stateless: the Back target is computed from the data, not carried in it.

| Data | Meaning |
|---|---|
| `r` | Show the continent list |
| `g:<region>` | Show the subregions of a region |
| `s:<subregion>:<page>` | Show a page of countries |
| `k:<code>` | A country was picked |
| `p:<id>` | An Open-Meteo place was picked |

## Planned change

City buttons for common cities, with typing as a fallback. See [[Roadmap]].
