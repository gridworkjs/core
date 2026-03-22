const POINT = 'point'
const RECT = 'rect'
const CIRCLE = 'circle'

function assertFinite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`)
  }
}

export function point(x, y) {
  assertFinite(x, 'x')
  assertFinite(y, 'y')
  return { type: POINT, x, y }
}

export function rect(minX, minY, maxX, maxY) {
  assertFinite(minX, 'minX')
  assertFinite(minY, 'minY')
  assertFinite(maxX, 'maxX')
  assertFinite(maxY, 'maxY')
  if (minX > maxX || minY > maxY) {
    throw new Error('inverted rect (minX > maxX or minY > maxY)')
  }
  return { type: RECT, minX, minY, maxX, maxY }
}

export function circle(x, y, radius) {
  assertFinite(x, 'x')
  assertFinite(y, 'y')
  assertFinite(radius, 'radius')
  if (radius < 0) {
    throw new Error('radius must be non-negative')
  }
  return { type: CIRCLE, x, y, radius }
}

export function isPoint(g) {
  return g !== null && typeof g === 'object' && g.type === POINT
}

export function isRect(g) {
  return g !== null && typeof g === 'object' && g.type === RECT
}

export function isCircle(g) {
  return g !== null && typeof g === 'object' && g.type === CIRCLE
}
