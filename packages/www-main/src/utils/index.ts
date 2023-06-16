import { v4 } from 'uuid'

// 生成一个 6 位数的随机数
export function generateRandomCode(len: 4 | 6) {
  const start = 10 ** (len - 1)
  const end = (10 - 1) * start
  const code = Math.floor(start + Math.random() * end)
  return code.toString()
}

export const generateSmsCode = () => generateRandomCode(6)

export function generateRandomUserName(len = 12) {
  const RANDOM_PREFIX = 'BGPT'
  const uid = v4().replace('-', '').slice(0, len)
  return `${RANDOM_PREFIX}${uid}`
}
