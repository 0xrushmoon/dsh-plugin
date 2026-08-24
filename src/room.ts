import type { Context } from '@deepseek-ai/cordis'
import type { Member, Room } from './types'

const rooms = new Map<string, Room>()
const members = new Map<string, Member>()

export function apply(ctx: Context) {
  ctx.effect(() => {
    return () => {
      rooms.clear()
      members.clear()
    }
  })
}

export function upsertMember(member: Member): Member {
  members.set(member.id, member)
  return member
}

export function createRoom(title: string, memberIds: string[]): Room {
  const room: Room = {
    id: `room_${Date.now().toString(36)}`,
    title,
    memberIds: [...memberIds],
  }
  rooms.set(room.id, room)
  return room
}

export function joinRoom(roomId: string, memberId: string): Room {
  const room = rooms.get(roomId)
  if (!room) throw new Error(`unknown room ${roomId}`)
  if (!room.memberIds.includes(memberId)) room.memberIds.push(memberId)
  return room
}

export function getRoom(id: string): Room | undefined {
  return rooms.get(id)
}

export function listMembers(roomId: string): Member[] {
  const room = rooms.get(roomId)
  if (!room) return []
  return room.memberIds.map((id) => members.get(id)).filter((m): m is Member => Boolean(m))
}
