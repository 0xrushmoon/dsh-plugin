import type { Context } from '@deepseek-ai/cordis'
import type { PermissionDecision } from './types'
import { listMembers } from './room'

/** Hard deny: role not in room, or tool not on that role's grant list. */
export function authorizeTool(roomId: string, roleId: string, tool: string): PermissionDecision {
  const member = listMembers(roomId).find((m) => m.id === roleId)
  if (!member) {
    return { ok: false, reason: `role ${roleId} is not in room ${roomId}` }
  }
  if (!member.tools.includes(tool)) {
    return { ok: false, reason: `role ${member.name} cannot call ${tool}` }
  }
  return { ok: true }
}

export function apply(_ctx: Context) {}
