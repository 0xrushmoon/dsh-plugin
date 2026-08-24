import assert from 'node:assert/strict'
import { parseMentions } from '../src/mention.ts'

const got = parseMentions('请 @技术专家-dsh 看一下，别叫 @产品')
assert.deepEqual(got, ['技术专家-dsh', '产品'])
console.log('parseMentions ok', got)
