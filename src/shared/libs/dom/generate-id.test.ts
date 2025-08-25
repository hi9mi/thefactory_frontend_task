import { describe, expect, it, vi } from 'vitest'

const MODULE_PATH = './generate-id'

async function fresh() {
  vi.resetModules()
  return await import(MODULE_PATH) as Promise<{ generateId: (prefix?: string, suffix?: string) => string }>
}

describe('generateId', () => {
  it('should start from 1 and increment by 1 for each call', async () => {
    const { generateId } = await fresh()
    expect(generateId()).toBe('id-1')
    expect(generateId()).toBe('id-2')
    expect(generateId()).toBe('id-3')
  })

  it('should allow custom prefix and suffix', async () => {
    const { generateId } = await fresh()
    expect(generateId('foo', '-bar')).toBe('foo-1-bar')
    expect(generateId('foo', '-bar')).toBe('foo-2-bar')
  })

  it('should maintain internal state within a single module instance', async () => {
    const { generateId } = await fresh()
    const a = generateId()
    const b = generateId()
    expect(a).not.toBe(b)
    const n1 = Number(a.split('-')[1])
    const n2 = Number(b.split('-')[1])
    expect(n2).toBe(n1 + 1)
  })

  it('should reset counter when the module is reloaded (fresh import)', async () => {
    let mod = await fresh()
    mod.generateId()
    mod.generateId()
    mod = await fresh()
    expect(mod.generateId()).toBe('id-1')
  })

  it('should generate unique ids over a batch', async () => {
    const { generateId } = await fresh()
    const set = new Set<string>()
    for (let i = 0; i < 50; i++) set.add(generateId())
    expect(set.size).toBe(50)
  })
})
