import type { Context } from '@deepseek-ai/cordis'
import type { Member, Turn } from './types'
import { listMembers } from './room'

/** Who should speak next. @ mention wins; otherwise all members see, none auto-replies. */
export function pickSpeakers(turn: Turn): Member[] {
  const roster = listMembers(turn.roomId)
  if (turn.mentions.length === 0) return []
  const wanted = new Set(turn.mentions.map((n) => n.replace(/^@/, '').toLowerCase()))
  return roster.filter((m) => wanted.has(m.name.toLowerCase()) || wanted.has(m.id.toLowerCase()))
}

export function apply(_ctx: Context) {
  // Routing is pure; mounted so unload stays in the plugin tree.
}
