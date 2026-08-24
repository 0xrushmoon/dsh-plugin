import type { Context } from '@deepseek-ai/cordis'
import type { Turn } from './types'

const log: Turn[] = []

export function appendTurn(turn: Turn): void {
  log.push(turn)
}

export function replay(roomId: string): Turn[] {
  return log.filter((t) => t.roomId === roomId).slice()
}

export function apply(ctx: Context) {
  ctx.effect(() => {
    return () => {
      log.length = 0
    }
  })
}
