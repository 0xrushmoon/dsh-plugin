import type { Context } from '@deepseek-ai/cordis'
import { apply as applyRooms } from './room'
import { apply as applyRouting } from './routing'
import { apply as applyMention } from './mention'
import { apply as applyPermissions } from './permissions'
import { apply as applySessionLog } from './session-log'

export const name = 'dsh-plugin'

/** Root plugin: team room, @ routing, permission deny, replayable session log. */
export function apply(ctx: Context) {
  applyRooms(ctx)
  applyRouting(ctx)
  applyMention(ctx)
  applyPermissions(ctx)
  applySessionLog(ctx)
  ctx.logger?.info?.('[dsh-plugin] loaded (rooms / routing / @ / permissions / session-log)')
}
