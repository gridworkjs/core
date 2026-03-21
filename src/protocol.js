export const SPATIAL_INDEX = Symbol.for('gridwork.spatialIndex')

const REQUIRED_METHODS = ['insert', 'remove', 'search', 'nearest', 'clear']

export function isSpatialIndex(obj) {
  if (obj === null || typeof obj !== 'object') return false
  if (!obj[SPATIAL_INDEX]) return false
  return REQUIRED_METHODS.every(m => typeof obj[m] === 'function')
}
