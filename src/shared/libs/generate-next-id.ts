let nextId = 0

export function generateNextId(prefix = 'id') {
  nextId++
  return `${prefix}-${nextId}`
}
