<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="12" fill="#1b2838"/>
    <line x1="20" y1="20" x2="20" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="40" y1="20" x2="40" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="60" y1="20" x2="60" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="80" y1="20" x2="80" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="100" y1="20" x2="100" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="20" y1="20" x2="100" y2="20" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="20" y1="40" x2="100" y2="40" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="20" y1="60" x2="100" y2="60" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="20" y1="80" x2="100" y2="80" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <line x1="20" y1="100" x2="100" y2="100" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    <circle cx="40" cy="40" r="4" fill="#5dade2"/>
    <circle cx="80" cy="60" r="4" fill="#5dade2"/>
    <circle cx="60" cy="80" r="4" fill="#5dade2"/>
    <rect x="30" y="30" width="30" height="30" rx="2" fill="none" stroke="#5dade2" stroke-width="2" stroke-dasharray="4 2"/>
  </svg>
</p>

<h1 align="center">@gridworkjs/core</h1>

<p align="center">geometry primitives and spatial index protocol</p>

## install

```
npm install @gridworkjs/core
```

## usage

```js
import {
  point, rect, circle,
  bounds, intersects, contains,
  SPATIAL_INDEX, isSpatialIndex
} from '@gridworkjs/core'

// create geometries
const p = point(10, 20)
const r = rect(0, 0, 100, 100)
const c = circle(50, 50, 25)

// compute bounding boxes
bounds(p)  // { minX: 10, minY: 20, maxX: 10, maxY: 20 }
bounds(c)  // { minX: 25, minY: 25, maxX: 75, maxY: 75 }

// spatial tests
intersects(bounds(r), bounds(c))  // true
contains(bounds(r), bounds(p))    // true
```

## API

### geometry

#### `point(x, y)`

Creates a point geometry.

#### `rect(minX, minY, maxX, maxY)`

Creates a rectangle geometry.

#### `circle(x, y, radius)`

Creates a circle geometry.

#### `isPoint(g)` / `isRect(g)` / `isCircle(g)`

Type checks for geometries.

### bounds

#### `bounds(geometry)`

Computes the axis-aligned bounding box of any geometry. Also accepts plain `{ minX, minY, maxX, maxY }` objects.

#### `intersects(a, b)`

Returns `true` if two bounding boxes overlap or touch.

#### `contains(a, b)`

Returns `true` if bounding box `a` fully contains bounding box `b`.

#### `merge(a, b)`

Returns the smallest bounding box that contains both `a` and `b`.

#### `area(bounds)`

Returns the area of a bounding box.

#### `enlargedArea(a, b)`

Returns the area of the bounding box that would result from merging `a` and `b`.

#### `distanceToPoint(bounds, px, py)`

Returns the minimum Euclidean distance from a bounding box to a point. Returns `0` if the point is inside.

#### `distanceBetween(a, b)`

Returns the minimum Euclidean distance between two bounding boxes. Returns `0` if they overlap.

#### `centerX(bounds)` / `centerY(bounds)`

Returns the center coordinate of a bounding box.

#### `expandBy(bounds, amount)`

Returns a new bounding box expanded by `amount` in all directions. Negative values shrink.

### protocol

#### `SPATIAL_INDEX`

A `Symbol` used to mark objects as spatial indexes. Every index in the gridwork ecosystem sets `[SPATIAL_INDEX] = true`.

#### `isSpatialIndex(obj)`

Returns `true` if `obj` implements the spatial index protocol: has the `SPATIAL_INDEX` symbol and all required methods (`insert`, `remove`, `search`, `nearest`, `clear`).

## license

MIT
