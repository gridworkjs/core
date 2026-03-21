import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SPATIAL_INDEX, isSpatialIndex } from '../src/protocol.js'

describe('SPATIAL_INDEX', () => {
  it('is a symbol', () => {
    assert.equal(typeof SPATIAL_INDEX, 'symbol')
  })

  it('is globally registered', () => {
    assert.equal(SPATIAL_INDEX, Symbol.for('gridwork.spatialIndex'))
  })
})

describe('isSpatialIndex', () => {
  function makeIndex() {
    return {
      [SPATIAL_INDEX]: true,
      insert() {},
      remove() {},
      search() { return [] },
      nearest() { return [] },
      clear() {}
    }
  }

  it('accepts a valid spatial index', () => {
    assert.equal(isSpatialIndex(makeIndex()), true)
  })

  it('rejects null', () => {
    assert.equal(isSpatialIndex(null), false)
  })

  it('rejects non-objects', () => {
    assert.equal(isSpatialIndex(42), false)
    assert.equal(isSpatialIndex('string'), false)
    assert.equal(isSpatialIndex(undefined), false)
  })

  it('rejects objects without the symbol', () => {
    const obj = {
      insert() {},
      remove() {},
      search() {},
      nearest() {},
      clear() {}
    }
    assert.equal(isSpatialIndex(obj), false)
  })

  it('rejects objects missing required methods', () => {
    const methods = ['insert', 'remove', 'search', 'nearest', 'clear']
    for (const missing of methods) {
      const obj = { [SPATIAL_INDEX]: true }
      for (const m of methods) {
        if (m !== missing) obj[m] = () => {}
      }
      assert.equal(isSpatialIndex(obj), false, `should reject when missing ${missing}`)
    }
  })

  it('rejects when methods are not functions', () => {
    const obj = {
      [SPATIAL_INDEX]: true,
      insert: 'not a function',
      remove() {},
      search() {},
      nearest() {},
      clear() {}
    }
    assert.equal(isSpatialIndex(obj), false)
  })
})
