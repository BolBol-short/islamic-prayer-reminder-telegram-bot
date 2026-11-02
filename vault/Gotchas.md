# Gotchas

Mistakes and surprises worth remembering.

## Running things

- `npx tgcloud ...`, not `npx cloud ...`. Without the `tg`, npx downloads an unrelated package named `cloud` and runs it, and it asks for an API key. Press Ctrl+C. Use `npm run` scripts from `package.json` when possible.
- PowerShell 5.1 removes double quotes inside arguments passed to programs. For `tgcloud run`, write JSON5 with single quotes inside a single-quoted string and double the inner quotes: `'{ chat: { id: 1 }, text: ''/start'' }'`.
- For `curl.exe` with a JSON body, write the body to a file and send it with `--data-binary "@file"`. Read secrets from `.dev.vars` into a variable instead of typing them.
- `tgcloud` prints `Assertion failed ... async.c` at exit on Windows. It is a harmless Node crash after the work is done.
- `wrangler kv key get` printed nothing in PowerShell until `--text` was added. A missing key shows as a 404 error.
- `npx tgcloud run` really sends the Telegram messages. It does not deploy.

## Code

- Relative imports need `.js`.
- Telegram's message has `chat.id`, not `chat_id`. A callback query has `message`, not `msg`.
- Table keys in the command router must be lowercase.
- `edit()` should ignore only the "message is not modified" error, so real 400 errors are not hidden.
- A callback button with empty `callback_data` or a missing `text` makes Telegram reject the whole keyboard.
- Do not name a constant `URL`. It shadows the built-in and breaks `new URL(...)`.
- In the Worker, `times[i]` indexes an array of five times. `times['Fajr']` is `undefined`, never throws, and never matches, so no reminder would ever be sent while the cron reports success.
- Editors auto-import. Two stray imports (`react` and a handler imported into its own library) appeared in files and had to be removed.

## Platform

- `push` never changes the database. After editing `schema.js`, run `push` and then `migrate`.
- Deleting a column from `schema.js` drops nothing. Drops need `.deprecated()`.
- Git commits do not deploy the bot. Only `npx tgcloud push` does, and `npx wrangler deploy` for the Worker.
- Wrangler config keys must sit at the right level. `TIMEZONE` placed outside `vars` is silently ignored.
- A throwaway file in `tgcloud/endpoints/` is deployed by the next `push`. Delete test and seed files first.
- The project folder is inside OneDrive, which slows `npm install` because of thousands of small files and syncs any seed file that holds a secret.

## Secrets

- The shared secret was pasted into a chat on 2026-10-30 and rotated on 2026-11-02. If a secret ever lands in a chat or a file, rotate it right away.
- To rotate without printing the value: generate it inside the shell, pipe it to `wrangler secret put`, write it into `.dev.vars` with a script, and pass it to a throwaway endpoint with `tgcloud run`, discarding that command's output because `run` echoes its arguments.
