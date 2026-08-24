# dsh-plugin architecture (MVP)

Runtime pin: `@deepseek-ai/dsh@0.1.1-rc.2`.
Plugin shape follows official docs: a TypeScript module exporting `name` + `apply(ctx)`.
https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md

## Mapping product → code

| MVP | Module | Cordis hook |
| --- | --- | --- |
| Room session | `src/room.ts` | `ctx.plugin` service `rooms` on ctx |
| Member routing | `src/routing.ts` | picks who should reply |
| @ dispatch | `src/mention.ts` | full `@角色名` (CJK + `-`), e.g. `@技术专家-dsh` |
| Permission deny | `src/permissions.ts` | tool call without role grant → hard reject |
| Replayable session | `src/session-log.ts` | append-only log; `replay(roomId)` rebuilds transcript |

Entry: `src/index.ts` `apply()` mounts the five plugins. Unload is automatic via Cordis effects.

## Load

Installable bundle: `package.json` `dsh.bundle.patch` → `./cordis.patch.yml` (`dsh plugin --profile web add .`).

1. `pnpm install`
2. Preferred: `pnpm web` → `dsh web --patch ./cordis.patch.yml` (resolves package name `dsh-plugin`).
3. Local absolute overlay fallback: edit `cordis.yml` `PLUGIN_ROOT`, then `pnpm web:local`.
4. Open `http://127.0.0.1:3080` (Creator / cordis preset).

Web 四条验收才算过；函数级自测不算。Gmail / Drive / X 不在 MVP。

## Out of MVP

Desktop app, full accounts, optional connectors, short @ aliases.
