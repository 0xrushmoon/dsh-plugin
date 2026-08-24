export type RoleId = string

export interface Member {
  id: RoleId
  name: string
  /** Tool names this role may call. Empty = no tools. */
  tools: string[]
}

export interface Room {
  id: string
  title: string
  memberIds: RoleId[]
}

export interface Turn {
  id: string
  roomId: string
  authorId: RoleId | 'user'
  /** Mentions parsed from the message, e.g. @产品专家-dsh */
  mentions: string[]
  body: string
  at: number
}

export interface PermissionDecision {
  ok: boolean
  reason?: string
}
