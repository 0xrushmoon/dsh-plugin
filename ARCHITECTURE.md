# dsh-plugin architecture (MVP)

Runtime pin: `@deepseek-ai/dsh@0.1.1-rc.2`.
Plugin shape follows official docs: a TypeScript module exporting `name` + `apply(ctx)`.
https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md

## Mapping product → code

| MVP | Module | Cordis hook |
| --- | --- | --- |
| Room session | `src/room.ts` | `ctx.plugin` service `rooms` on ctx |
| Member routing | `src/routing.ts` | picks who should reply |
| @ dispatch | `src/mention.ts` | parse `@Name`, route to that member; others still see the turn |
| Permission deny | `src/permissions.ts` | tool call without role grant → hard reject |
| Replayable session | `src/session-log.ts` | append-only log; `replay(roomId)` rebuilds transcript |

Entry: `src/index.ts` `apply()` mounts the five plugins. Unload is automatic via Cordis effects.

## Load

1. `pnpm install`
2. Edit `cordis.yml`: replace `PLUGIN_ROOT` with this repo's absolute path.
3. `pnpm web` or `npx @deepseek-ai/dsh@0.1.1-rc.2 web --patch ./cordis.yml`
4. Open `http://127.0.0.1:3080` (Creator / cordis preset).

No DeepSeek API key is required to load the skeleton. Gmail / Drive / X are out of MVP.

## Out of MVP

Desktop app, full accounts, optional connectors.
