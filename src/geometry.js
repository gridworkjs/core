const POINT = 'point'
const RECT = 'rect'
const CIRCLE = 'circle'

export function point(x, y) {
  return { type: POINT, x, y }
}

export function rect(minX, minY, maxX, maxY) {
  return { type: RECT, minX, minY, maxX, maxY }
}

export function circle(x, y, radius) {
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
