import type { Context } from '@deepseek-ai/cordis'
import { apply as applyRooms } from './room'
import { apply as applyRouting } from './routing'
import { apply as applyMention } from './mention'
import { apply as applyPermissions } from './permissions'
import { apply as applySessionLog } from './session-log'
import { apply as applyHarnessTools } from './harness-tools'

export const name = 'dsh-plugin'
export const inject = ['tools']

/** Root plugin: team room, @ routing, permission deny, replayable session log. */
export function apply(ctx: Context) {
  applyRooms(ctx)
  applyRouting(ctx)
  applyMention(ctx)
  applyPermissions(ctx)
  applySessionLog(ctx)
  applyHarnessTools(ctx)
}
