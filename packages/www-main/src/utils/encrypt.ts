import bcrypt from 'bcrypt'

export const encrypt = (password: string) => bcrypt.hashSync(password, 10)

export function checkPassword(password: string, hash: string) {
  return bcrypt.compareSync(hash, password)
}
