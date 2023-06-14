import bcrypt from "bcrypt"

export const encrypt = (password: string) => bcrypt.hashSync(password, 10)

export const checkPassword = (password: string, hash: string) =>
  bcrypt.compareSync(hash, password)
