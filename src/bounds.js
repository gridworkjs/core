export function bounds(geometry) {
  switch (geometry.type) {
    case 'point':
      return { minX: geometry.x, minY: geometry.y, maxX: geometry.x, maxY: geometry.y }
    case 'rect':
      return { minX: geometry.minX, minY: geometry.minY, maxX: geometry.maxX, maxY: geometry.maxY }
    case 'circle':
      return {
        minX: geometry.x - geometry.radius,
        minY: geometry.y - geometry.radius,
        maxX: geometry.x + geometry.radius,
        maxY: geometry.y + geometry.radius
      }
    default:
      if ('minX' in geometry && 'minY' in geometry && 'maxX' in geometry && 'maxY' in geometry) {
        return { minX: geometry.minX, minY: geometry.minY, maxX: geometry.maxX, maxY: geometry.maxY }
      }
      throw new Error(`cannot compute bounds for unknown geometry type: ${geometry.type}`)
  }
}

export function intersects(a, b) {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
}

export function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && a.maxX >= b.maxX && a.maxY >= b.maxY
}

export function merge(a, b) {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY)
  }
}

export function area(b) {
  return (b.maxX - b.minX) * (b.maxY - b.minY)
}

export function enlargedArea(a, b) {
  const w = Math.max(a.maxX, b.maxX) - Math.min(a.minX, b.minX)
  const h = Math.max(a.maxY, b.maxY) - Math.min(a.minY, b.minY)
  return w * h
}

export function distanceToPoint(b, px, py) {
  const dx = Math.max(b.minX - px, 0, px - b.maxX)
  const dy = Math.max(b.minY - py, 0, py - b.maxY)
  return Math.sqrt(dx * dx + dy * dy)
}

export function distanceBetween(a, b) {
  const dx = Math.max(a.minX - b.maxX, 0, b.minX - a.maxX)
  const dy = Math.max(a.minY - b.maxY, 0, b.minY - a.maxY)
  return Math.sqrt(dx * dx + dy * dy)
}

export function centerX(b) {
  return (b.minX + b.maxX) / 2
}

export function centerY(b) {
  return (b.minY + b.maxY) / 2
}

export function expandBy(b, amount) {
  const cx = (b.minX + b.maxX) / 2
  const cy = (b.minY + b.maxY) / 2
  const hx = Math.max(0, (b.maxX - b.minX) / 2 + amount)
  const hy = Math.max(0, (b.maxY - b.minY) / 2 + amount)
  return {
    minX: cx - hx,
    minY: cy - hy,
    maxX: cx + hx,
    maxY: cy + hy
  }
}
