import type { Context } from '@deepseek-ai/cordis'
import type { Turn } from './types'
import { pickSpeakers } from './routing'
import { appendTurn } from './session-log'

const MENTION = /@([\w.-]+|[\u4e00-\u9fff][\w.-\u4e00-\u9fff]*)/g

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
