/**
 * 深拷贝工具（替代 Vue2 的 this.$deepCopy）
 * 使用递归方式处理 Date、Map、Set、Object、Array 等
 */
export function deepClone(obj) {
  if (obj === null || obj === undefined) return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Map) {
    const newMap = new Map()
    obj.forEach((value, key) => {
      newMap.set(deepClone(key), deepClone(value))
    })
    return newMap
  }
  if (obj instanceof Set) {
    const newSet = new Set()
    obj.forEach(value => newSet.add(deepClone(value)))
    return newSet
  }
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => deepClone(item))
  const clone = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

/**
 * 判断值是否非空（替代 Vue2 的 this.$isNotEmpty）
 */
export function isNotEmpty(val) {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  return true
}
