import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { point, rect, circle } from '../src/geometry.js'
import {
  bounds, intersects, contains, merge, area, enlargedArea,
  distanceToPoint, distanceBetween, centerX, centerY, expandBy
} from '../src/bounds.js'

describe('bounds', () => {
  it('computes point bounds as zero-area', () => {
    const b = bounds(point(3, 7))
    assert.deepEqual(b, { minX: 3, minY: 7, maxX: 3, maxY: 7 })
  })

  it('computes rect bounds as identity', () => {
    const b = bounds(rect(1, 2, 3, 4))
    assert.deepEqual(b, { minX: 1, minY: 2, maxX: 3, maxY: 4 })
  })

  it('computes circle bounds as enclosing rect', () => {
    const b = bounds(circle(10, 20, 5))
    assert.deepEqual(b, { minX: 5, minY: 15, maxX: 15, maxY: 25 })
  })

  it('passes through plain bounds objects', () => {
    const b = bounds({ minX: 0, minY: 0, maxX: 10, maxY: 10 })
    assert.deepEqual(b, { minX: 0, minY: 0, maxX: 10, maxY: 10 })
  })

  it('validates plain bounds have finite numbers', () => {
    assert.throws(() => bounds({ minX: NaN, minY: 0, maxX: 10, maxY: 10 }), /finite numbers/)
    assert.throws(() => bounds({ minX: 0, minY: Infinity, maxX: 10, maxY: 10 }), /finite numbers/)
    assert.throws(() => bounds({ minX: 'a', minY: 0, maxX: 10, maxY: 10 }), /finite numbers/)
    assert.throws(() => bounds({ minX: 0, minY: 0, maxX: undefined, maxY: 10 }), /finite numbers/)
    assert.throws(() => bounds({ minX: 0, minY: 0, maxX: 10, maxY: null }), /finite numbers/)
  })

  it('validates plain bounds are not inverted', () => {
    assert.throws(() => bounds({ minX: 10, minY: 0, maxX: 5, maxY: 10 }), /inverted bounds/)
    assert.throws(() => bounds({ minX: 0, minY: 10, maxX: 10, maxY: 5 }), /inverted bounds/)
  })

  it('accepts zero-area plain bounds', () => {
    const b = bounds({ minX: 5, minY: 5, maxX: 5, maxY: 5 })
    assert.deepEqual(b, { minX: 5, minY: 5, maxX: 5, maxY: 5 })
  })

  it('computes circle bounds with zero radius', () => {
    const b = bounds(circle(3, 7, 0))
    assert.deepEqual(b, { minX: 3, minY: 7, maxX: 3, maxY: 7 })
  })

  it('computes circle bounds with negative center', () => {
    const b = bounds(circle(-5, -10, 3))
    assert.deepEqual(b, { minX: -8, minY: -13, maxX: -2, maxY: -7 })
  })

  it('throws on unknown geometry', () => {
    assert.throws(() => bounds({ type: 'polygon' }), /unknown geometry type/)
  })

  it('throws on null input', () => {
    assert.throws(() => bounds(null))
  })

  it('throws on undefined input', () => {
    assert.throws(() => bounds(undefined))
  })
})

describe('intersects', () => {
  it('detects overlapping rects', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const b = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    assert.equal(intersects(a, b), true)
  })

  it('detects non-overlapping rects', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const b = { minX: 6, minY: 6, maxX: 10, maxY: 10 }
    assert.equal(intersects(a, b), false)
  })

  it('detects edge-touching as intersecting', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const b = { minX: 5, minY: 0, maxX: 10, maxY: 5 }
    assert.equal(intersects(a, b), true)
  })

  it('detects containment as intersecting', () => {
    const outer = { minX: 0, minY: 0, maxX: 100, maxY: 100 }
    const inner = { minX: 10, minY: 10, maxX: 20, maxY: 20 }
    assert.equal(intersects(outer, inner), true)
    assert.equal(intersects(inner, outer), true)
  })

  it('handles point bounds', () => {
    const a = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    const b = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    assert.equal(intersects(a, b), true)
  })

  it('handles separated on x axis only', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 10 }
    const b = { minX: 6, minY: 0, maxX: 10, maxY: 10 }
    assert.equal(intersects(a, b), false)
  })

  it('handles separated on y axis only', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 5 }
    const b = { minX: 0, minY: 6, maxX: 10, maxY: 10 }
    assert.equal(intersects(a, b), false)
  })
})

describe('contains', () => {
  it('detects containment', () => {
    const outer = { minX: 0, minY: 0, maxX: 100, maxY: 100 }
    const inner = { minX: 10, minY: 10, maxX: 20, maxY: 20 }
    assert.equal(contains(outer, inner), true)
    assert.equal(contains(inner, outer), false)
  })

  it('exact match is containment', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    assert.equal(contains(a, a), true)
  })

  it('partially overlapping is not containment', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const b = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    assert.equal(contains(a, b), false)
  })

  it('contains a point bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const p = { minX: 5, minY: 5, maxX: 5, maxY: 5 }
    assert.equal(contains(a, p), true)
  })
})

describe('merge', () => {
  it('merges two bounds into enclosing bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const b = { minX: 3, minY: 3, maxX: 10, maxY: 10 }
    assert.deepEqual(merge(a, b), { minX: 0, minY: 0, maxX: 10, maxY: 10 })
  })

  it('merge with self is identity', () => {
    const a = { minX: 1, minY: 2, maxX: 3, maxY: 4 }
    assert.deepEqual(merge(a, a), a)
  })

  it('merges fully disjoint bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 2, maxY: 2 }
    const b = { minX: 8, minY: 8, maxX: 10, maxY: 10 }
    assert.deepEqual(merge(a, b), { minX: 0, minY: 0, maxX: 10, maxY: 10 })
  })
})

describe('area', () => {
  it('computes area', () => {
    assert.equal(area({ minX: 0, minY: 0, maxX: 10, maxY: 5 }), 50)
  })

  it('zero-area for point bounds', () => {
    assert.equal(area({ minX: 5, minY: 5, maxX: 5, maxY: 5 }), 0)
  })

  it('zero-area for line bounds', () => {
    assert.equal(area({ minX: 0, minY: 0, maxX: 10, maxY: 0 }), 0)
  })
})

describe('enlargedArea', () => {
  it('computes the area if two bounds were merged', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const b = { minX: 3, minY: 3, maxX: 10, maxY: 10 }
    assert.equal(enlargedArea(a, b), 100)
  })

  it('equals area of outer when one contains the other', () => {
    const outer = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const inner = { minX: 2, minY: 2, maxX: 5, maxY: 5 }
    assert.equal(enlargedArea(outer, inner), 100)
  })

  it('equals area for identical bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 4, maxY: 6 }
    assert.equal(enlargedArea(a, a), 24)
  })

  it('handles disjoint bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 2, maxY: 2 }
    const b = { minX: 8, minY: 8, maxX: 10, maxY: 10 }
    assert.equal(enlargedArea(a, b), 100)
  })
})

describe('distanceToPoint', () => {
  it('zero when point is inside bounds', () => {
    assert.equal(distanceToPoint({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 5, 5), 0)
  })

  it('zero when point is on edge', () => {
    assert.equal(distanceToPoint({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 10, 5), 0)
  })

  it('horizontal distance', () => {
    assert.equal(distanceToPoint({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 13, 5), 3)
  })

  it('vertical distance', () => {
    assert.equal(distanceToPoint({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 5, -4), 4)
  })

  it('diagonal distance', () => {
    const d = distanceToPoint({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 13, 14)
    assert.equal(d, 5)
  })

  it('distance from zero-area bounds', () => {
    assert.equal(distanceToPoint({ minX: 5, minY: 5, maxX: 5, maxY: 5 }, 8, 9), 5)
  })

  it('zero when point coincides with zero-area bounds', () => {
    assert.equal(distanceToPoint({ minX: 5, minY: 5, maxX: 5, maxY: 5 }, 5, 5), 0)
  })
})

describe('distanceBetween', () => {
  it('zero when overlapping', () => {
    const a = { minX: 0, minY: 0, maxX: 10, maxY: 10 }
    const b = { minX: 5, minY: 5, maxX: 15, maxY: 15 }
    assert.equal(distanceBetween(a, b), 0)
  })

  it('zero when touching', () => {
    const a = { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    const b = { minX: 5, minY: 0, maxX: 10, maxY: 5 }
    assert.equal(distanceBetween(a, b), 0)
  })

  it('computes gap distance', () => {
    const a = { minX: 0, minY: 0, maxX: 3, maxY: 4 }
    const b = { minX: 6, minY: 0, maxX: 10, maxY: 4 }
    assert.equal(distanceBetween(a, b), 3)
  })

  it('diagonal gap', () => {
    const a = { minX: 0, minY: 0, maxX: 3, maxY: 4 }
    const b = { minX: 6, minY: 8, maxX: 10, maxY: 12 }
    assert.equal(distanceBetween(a, b), 5)
  })

  it('distance between zero-area bounds', () => {
    const a = { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    const b = { minX: 3, minY: 4, maxX: 3, maxY: 4 }
    assert.equal(distanceBetween(a, b), 5)
  })
})

describe('centerX / centerY', () => {
  it('computes center', () => {
    const b = { minX: 0, minY: 0, maxX: 10, maxY: 20 }
    assert.equal(centerX(b), 5)
    assert.equal(centerY(b), 10)
  })

  it('center of negative bounds', () => {
    const b = { minX: -10, minY: -6, maxX: -4, maxY: -2 }
    assert.equal(centerX(b), -7)
    assert.equal(centerY(b), -4)
  })

  it('center of zero-area bounds', () => {
    assert.equal(centerX({ minX: 7, minY: 3, maxX: 7, maxY: 3 }), 7)
    assert.equal(centerY({ minX: 7, minY: 3, maxX: 7, maxY: 3 }), 3)
  })

  it('center of asymmetric bounds', () => {
    const b = { minX: 1, minY: 2, maxX: 5, maxY: 12 }
    assert.equal(centerX(b), 3)
    assert.equal(centerY(b), 7)
  })
})

describe('expandBy', () => {
  it('expands bounds in all directions', () => {
    const b = expandBy({ minX: 5, minY: 5, maxX: 10, maxY: 10 }, 2)
    assert.deepEqual(b, { minX: 3, minY: 3, maxX: 12, maxY: 12 })
  })

  it('shrinks with negative amount', () => {
    const b = expandBy({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, -2)
    assert.deepEqual(b, { minX: 2, minY: 2, maxX: 8, maxY: 8 })
  })

  it('clamps to zero-area when shrinking past center', () => {
    const b = expandBy({ minX: 0, minY: 0, maxX: 4, maxY: 4 }, -3)
    assert.ok(b.minX <= b.maxX, 'minX should not exceed maxX')
    assert.ok(b.minY <= b.maxY, 'minY should not exceed maxY')
    assert.equal(b.minX, b.maxX)
    assert.equal(b.minY, b.maxY)
    assert.equal(b.minX, 2)
    assert.equal(b.minY, 2)
  })

  it('shrinks asymmetrically and clamps the smaller dimension', () => {
    const b = expandBy({ minX: 0, minY: 0, maxX: 10, maxY: 6 }, -3)
    assert.deepEqual(b, { minX: 3, minY: 3, maxX: 7, maxY: 3 })
  })

  it('throws on NaN amount', () => {
    assert.throws(() => expandBy({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, NaN), /finite number/)
  })

  it('throws on Infinity amount', () => {
    assert.throws(() => expandBy({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, Infinity), /finite number/)
  })

  it('throws on non-numeric amount', () => {
    assert.throws(() => expandBy({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, 'big'), /finite number/)
  })
})
