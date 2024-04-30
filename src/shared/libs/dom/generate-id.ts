function createIdGenerator() {
  let nextId = 0
  return function generateId(prefix = 'id', suffix = '') {
    nextId++
    return `${prefix}-${nextId}${suffix}`
  }
}

export const generateId = createIdGenerator()
