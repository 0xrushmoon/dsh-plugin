import type { Context } from '@deepseek-ai/cordis'
import type { Turn } from './types'
import { pickSpeakers } from './routing'
import { appendTurn } from './session-log'

/** Full role name only: CJK/ASCII plus internal hyphens. e.g. @技术专家-dsh */
const MENTION = /@([\u4e00-\u9fffA-Za-z0-9]+(?:-[\u4e00-\u9fffA-Za-z0-9]+)*)/g

export function parseMentions(body: string): string[] {
  const found: string[] = []
  for (const m of body.matchAll(MENTION)) {
    if (m[1]) found.push(m[1])
  }
  return found
}

/** Record a user (or member) message; named members are the ones expected to reply. */
export function dispatchMessage(roomId: string, authorId: Turn['authorId'], body: string): {
  turn: Turn
  speakerIds: string[]
} {
  const turn: Turn = {
    id: `t_${Date.now().toString(36)}`,
    roomId,
    authorId,
    mentions: parseMentions(body),
    body,
    at: Date.now(),
  }
  appendTurn(turn)
  const speakers = pickSpeakers(turn)
  return { turn, speakerIds: speakers.map((s) => s.id) }
}

export function apply(_ctx: Context) {}
