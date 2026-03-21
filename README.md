<p align="center">
  <img src="logo.svg" width="120" height="120" alt="@gridworkjs/core">
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
