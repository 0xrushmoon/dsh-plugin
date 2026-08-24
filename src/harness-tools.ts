import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { createRoom, joinRoom, listMembers, upsertMember } from './room'
import { dispatchMessage } from './mention'
import { authorizeTool } from './permissions'
import { replay } from './session-log'

function jsonOut() {
  return {
    schema: { type: 'object' as const },
    render: (_args: unknown, value: unknown) => [{ type: 'text' as const, text: JSON.stringify(value) }],
  }
}

/** Model-facing tools so Web ACCEPTANCE can drive rooms / @ / replay / deny. */
export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'dsh_room_create',
    description: 'Create a team room and pull at least two named roles into the same session.',
    parameters: {
      title: { type: 'string', required: true, description: 'Room title' },
      members: {
        type: 'array',
        required: true,
        items: { type: 'string' },
        description: 'Full role names, e.g. 技术专家-dsh. At least two.',
      },
    },
    output: jsonOut(),
    async execute(args) {
      const names = args.members as string[]
      if (names.length < 2) throw new Error('need at least two members')
      const ids: string[] = []
      for (const name of names) {
        upsertMember({ id: name, name, tools: name.includes('项目') ? ['dsh_restricted'] : [] })
        ids.push(name)
      }
      const room = createRoom(args.title as string, ids)
      return { roomId: room.id, title: room.title, members: listMembers(room.id).map((m) => m.name) }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'dsh_room_join',
    description: 'Join an existing room as a named role (same session).',
    parameters: {
      roomId: { type: 'string', required: true },
      name: { type: 'string', required: true, description: 'Full role name' },
    },
    output: jsonOut(),
    async execute(args) {
      const name = args.name as string
      upsertMember({ id: name, name, tools: [] })
      const room = joinRoom(args.roomId as string, name)
      return { roomId: room.id, members: listMembers(room.id).map((m) => m.name) }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'dsh_dispatch',
    description: 'Post a message into a room. @FullRoleName (CJK + hyphen) picks who replies; others still see the turn.',
    parameters: {
      roomId: { type: 'string', required: true },
      body: { type: 'string', required: true },
      authorId: { type: 'string', description: 'Defaults to user' },
    },
    output: jsonOut(),
    async execute(args) {
      const result = dispatchMessage(args.roomId as string, (args.authorId as string) || 'user', args.body as string)
      return {
        turnId: result.turn.id,
        mentions: result.turn.mentions,
        speakerIds: result.speakerIds,
        visibleToAll: true,
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'dsh_session_replay',
    description: 'Replay the durable session log for a room after leaving and rejoining.',
    parameters: {
      roomId: { type: 'string', required: true },
    },
    output: jsonOut(),
    async execute(args) {
      return { roomId: args.roomId, turns: replay(args.roomId as string) }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'dsh_restricted',
    description: 'Example gated tool. Roles without grant must be hard-denied (error, not silent success).',
    parameters: {
      roomId: { type: 'string', required: true },
      roleId: { type: 'string', required: true, description: 'Full role name invoking the tool' },
    },
    output: jsonOut(),
    async execute(args) {
      const decision = authorizeTool(args.roomId as string, args.roleId as string, 'dsh_restricted')
      if (!decision.ok) {
        throw new Error(decision.reason || 'permission denied')
      }
      return { ok: true, result: 'restricted work done' }
    },
  }))
}
