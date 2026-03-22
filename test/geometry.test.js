import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { point, rect, circle, isPoint, isRect, isCircle } from '../src/geometry.js'

describe('point', () => {
  it('creates a point with x and y', () => {
    const p = point(3, 7)
    assert.equal(p.type, 'point')
    assert.equal(p.x, 3)
    assert.equal(p.y, 7)
  })

  it('handles negative coordinates', () => {
    const p = point(-5, -10)
    assert.equal(p.x, -5)
    assert.equal(p.y, -10)
  })

  it('handles zero', () => {
    const p = point(0, 0)
    assert.equal(p.x, 0)
    assert.equal(p.y, 0)
  })

  it('handles fractional coordinates', () => {
    const p = point(1.5, 2.7)
    assert.equal(p.x, 1.5)
    assert.equal(p.y, 2.7)
  })
})

describe('rect', () => {
  it('creates a rect with min/max coordinates', () => {
    const r = rect(0, 0, 10, 20)
    assert.equal(r.type, 'rect')
    assert.equal(r.minX, 0)
    assert.equal(r.minY, 0)
    assert.equal(r.maxX, 10)
    assert.equal(r.maxY, 20)
  })

  it('handles negative coordinates', () => {
    const r = rect(-10, -20, -5, -3)
    assert.equal(r.minX, -10)
    assert.equal(r.minY, -20)
    assert.equal(r.maxX, -5)
    assert.equal(r.maxY, -3)
  })

  it('handles zero-area rect', () => {
    const r = rect(5, 5, 5, 5)
    assert.equal(r.minX, 5)
    assert.equal(r.maxX, 5)
  })
})

describe('circle', () => {
  it('creates a circle with center and radius', () => {
    const c = circle(5, 10, 3)
    assert.equal(c.type, 'circle')
    assert.equal(c.x, 5)
    assert.equal(c.y, 10)
    assert.equal(c.radius, 3)
  })

  it('handles zero radius', () => {
    const c = circle(0, 0, 0)
    assert.equal(c.radius, 0)
  })
})

describe('type checks', () => {
  it('isPoint identifies points', () => {
    assert.equal(isPoint(point(0, 0)), true)
    assert.equal(isPoint(rect(0, 0, 1, 1)), false)
    assert.equal(isPoint(circle(0, 0, 1)), false)
  })

  it('isRect identifies rects', () => {
    assert.equal(isRect(rect(0, 0, 1, 1)), true)
    assert.equal(isRect(point(0, 0)), false)
    assert.equal(isRect(circle(0, 0, 1)), false)
  })

  it('isCircle identifies circles', () => {
    assert.equal(isCircle(circle(0, 0, 1)), true)
    assert.equal(isCircle(point(0, 0)), false)
    assert.equal(isCircle(rect(0, 0, 1, 1)), false)
  })

  it('rejects null and non-objects', () => {
    assert.equal(isPoint(null), false)
    assert.equal(isPoint(undefined), false)
    assert.equal(isPoint(42), false)
    assert.equal(isPoint('point'), false)
    assert.equal(isRect(null), false)
    assert.equal(isCircle(null), false)
  })

  it('rejects plain objects without type', () => {
    assert.equal(isPoint({ x: 0, y: 0 }), false)
    assert.equal(isRect({ minX: 0, minY: 0, maxX: 1, maxY: 1 }), false)
  })
})

describe('validation', () => {
  it('point throws on NaN x', () => {
    assert.throws(() => point(NaN, 0), { message: 'x must be a finite number' })
  })

  it('point throws on Infinity y', () => {
    assert.throws(() => point(0, Infinity), { message: 'y must be a finite number' })
  })

  it('rect throws on NaN coordinate', () => {
    assert.throws(() => rect(NaN, 0, 10, 10), { message: 'minX must be a finite number' })
  })

  it('rect throws on inverted bounds (minX > maxX)', () => {
    assert.throws(() => rect(10, 0, 5, 10), { message: 'inverted rect (minX > maxX or minY > maxY)' })
  })

  it('rect throws on inverted bounds (minY > maxY)', () => {
    assert.throws(() => rect(0, 10, 10, 5), { message: 'inverted rect (minX > maxX or minY > maxY)' })
  })

  it('circle throws on negative radius', () => {
    assert.throws(() => circle(0, 0, -1), { message: 'radius must be non-negative' })
  })

  it('circle throws on NaN center', () => {
    assert.throws(() => circle(NaN, 0, 5), { message: 'x must be a finite number' })
  })

  it('circle throws on NaN radius', () => {
    assert.throws(() => circle(0, 0, NaN), { message: 'radius must be a finite number' })
  })

  it('circle throws on Infinity radius', () => {
    assert.throws(() => circle(0, 0, Infinity), { message: 'radius must be a finite number' })
  })

  it('point throws on string input', () => {
    assert.throws(() => point('hello', 0), { message: 'x must be a finite number' })
  })

  it('rect throws on undefined input', () => {
    assert.throws(() => rect(undefined, 0, 10, 10), { message: 'minX must be a finite number' })
  })
})
