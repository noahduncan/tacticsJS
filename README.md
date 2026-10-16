# tacticsJS

An early-stage, browser-based tactics RPG built with TypeScript and [three.js](https://threejs.org/). It's inspired by isometric grid tactics games: units move around a 3D tile map where height, terrain and equipment affect what they can do.

## Status

This is a work in progress. What exists so far:

- **3D tile maps** made of box tiles with varying heights and random terrain (dirt, grass, snow). Generators exist for random maps, a 1D ramp and a 2D ramp.
- **Units** with equipment slots (head, body, arms, legs, feet). Stats such as movement, jump, attack, defense and weight are derived from the equipped gear.
- **Movement rules**: moving costs horizontal (Manhattan) distance plus any height difference beyond the unit's jump stat. A unit can't move into an occupied tile or spend more movement than it has.
- **Sprite sheets**: animation frames exported from [Aseprite](https://www.aseprite.org/) are loaded as three.js sprites.
- **Debug tooling**: orbit camera controls, an axes helper and a [dat.GUI](https://github.com/dataarts/dat.gui) panel for tweaking unit stats.

> **Note:** In the current commit, map and unit rendering is commented out in `src/index.ts` while sprite rendering is being developed, so only the Blob sprite appears in the scene.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (the repo includes a `yarn.lock`)

### Install

```sh
yarn install
```

### Build

Webpack compiles `src/index.ts` into `dist/main.js` (development mode, with inline source maps):

```sh
yarn webpack
```

Add `--watch` to rebuild when files change:

```sh
yarn webpack --watch
```

### Run

Serve the project root with `http-server` and open the printed URL (default http://localhost:8080):

```sh
yarn http-server
```

Serve it over HTTP rather than opening `index.html` directly from the filesystem, because the sprite textures are loaded at runtime.

## Controls

| Input | Action |
| --- | --- |
| Mouse drag / scroll | Orbit and zoom the camera |
| Arrow keys | Move the unit one tile (when map and unit rendering are enabled) |
| GUI panel (top right) | Adjust the unit's remaining movement |

For debugging, the map, unit and sprite are also available in the browser console as `window.map`, `window.unit` and `window.sprite`.

## Project structure

```
index.html                  Page shell; loads dist/main.js
webpack.config.js           Bundles src/index.ts -> dist/main.js
tsconfig.json
src/
  index.ts                  Scene setup, camera, controls, GUI, input handling, render loop
  SpriteSheet.ts            Parses Aseprite JSON exports into UV frames and three.js Sprites
  Grid/
    Map.ts                  Map, Location and Coordinate types; map generators; unit placement and movement
    TerrainTypes/           Terrain interface, material config, and Dirt / Grass / Snow terrains
  Unit/
    Unit.ts                 Unit base class, equipment interfaces, starter gear, BasicUnit
  assets/sprites/           Aseprite sources (.aseprite) and exported sheets (.png + .json)
```

## Adding sprites

1. Create the sprite in Aseprite and save the `.aseprite` source under `src/assets/sprites/<name>/`.
2. Export a sprite sheet with JSON data (hash format, frame tags included) next to it.
3. Import the JSON in TypeScript and wrap it in a `SpriteSheet`:

   ```ts
   import * as sprites from "./assets/sprites/blob/Blob.json";
   import SpriteSheet from "./SpriteSheet";

   const sheet = new SpriteSheet(sprites);
   scene.add(sheet.getSprite("Blob"));
   ```

`SpriteSheet` currently resolves images from `src/assets/sprites/blob/`, so other sprites will need that path made configurable.

## Roadmap

Planned systems, from the notes in `src/index.ts`:

1. Initialization / animation handler
2. Map
3. Units
4. Combat system
5. Scenario management / win conditions
6. Equipment
7. Magic system
8. Story line
9. UI manager
