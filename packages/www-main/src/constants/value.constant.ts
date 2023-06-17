export const NULL = null
export const UNDEFINED = undefined

export const isNull = value => value === NULL
export const isUndefined = value => value === UNDEFINED
export const isVoid = value => isNull(value) || isUndefined(value)
