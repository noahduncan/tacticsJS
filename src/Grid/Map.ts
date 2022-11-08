// A grid is made up of tiles.
// Tiles are composed of a terrain type.
// Tiles may have a modifier: e.g. difficult terrain or impassible.
// Terrain types have a three.js material.
// Terrain Types may have a modifier: e.g. difficult terrain or impassible.

import {randInt} from "three/src/math/MathUtils";
import * as THREE from "three";
import * as TerrainType from './TerrainTypes/TerrainType';
import Dirt from "./TerrainTypes/Dirt";
import Grass from "./TerrainTypes/Grass";
import Snow from "./TerrainTypes/Snow";
import {Unit} from "../Unit/Unit";
import {Scene} from "three";

class Location {
    x: number;
    y: number;
    height: number;
    terrain: TerrainType.Terrain;
    geometry: THREE.BoxGeometry;
    mesh: THREE.Mesh;
    unit: Unit | null;

    constructor(x: number, y: number, height: number, terrain: TerrainType.Terrain) {
        this.x = x;
        this.y = y;
        this.height = height * 0.5;
        this.terrain = terrain;
        this.unit = null;

        this.generateMesh();
    }

    private generateMesh() {
        this.geometry = new THREE.BoxGeometry(1, 1, this.height);
        this.geometry.translate(0.5, 0.5, 0.5*this.height);

        this.mesh = new THREE.Mesh(this.geometry, this.terrain.material);
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;

        const geo = new THREE.EdgesGeometry(this.mesh.geometry);
        const mat = new THREE.LineBasicMaterial( { color: 0x0000000 } );
        const wireframe = new THREE.LineSegments( geo, mat);
        this.mesh.add(wireframe);
    }
}

function randomProperty(obj: any) {
    const keys = Object.keys(obj);
    return obj[keys[randInt(0, keys.length -1)]];
}

/**
 * @todo This type may need to move to somewhere more generic, like the UI manager.
 */
export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Map {
    locations: Array<Array<Location>> = [];
    width: number;
    length: number;
    constructor(width: number, length: number) {
        this.width = width;
        this.length = length;
    }

    placeUnit(coordinate: Coordinate, unit: Unit|null) {
        let location = this.locations[coordinate.x][coordinate.y];
        if (location.unit !== null) {
            throw new Error('Cannot place unit, location is already occupied.');
        }
        location.unit = unit;
        unit.mesh.position.x = coordinate.x;
        unit.mesh.position.y = coordinate.y;
        unit.mesh.position.z = location.height;
    }

    getLocation(coordinate: Coordinate): Location {
        return this.locations[coordinate.x][coordinate.y];
    }

    /**
     * Move a unit from one coordinate to another.
     * @todo The inputs for this seem to be better served as locations, not coordinates.
     * @param from
     * @param to
     */
    moveUnit(from: Coordinate, to: Coordinate): MovementResult {
        if (this.getLocation(to).unit !== null) {
            throw new Error('Cannot move unit, target location is not empty.')
        }

        if (this.getLocation(from).unit === null) {
            throw new Error('Cannot move unit, no unit to move.');
        }

        let unit = this.getLocation(from).unit;
        let xyMovementCost = Math.abs(to.x - from.x) + Math.abs(to.y - from .y);
        let jumpMovementCost = Math.ceil(Math.abs(this.getLocation(to).height - this.getLocation(from).height));

        let totalMovementCost = xyMovementCost + Math.max(0, jumpMovementCost - unit.jump);

        if (totalMovementCost > unit.stats.movement) {
            throw new Error('Cannot move unit, not enough movement.');
        }

        unit.mesh.position.x = to.x;
        unit.mesh.position.y = to.y;
        unit.mesh.position.z = this.getLocation(to).height;
        unit.stats.movement -= totalMovementCost;
        this.getLocation(to).unit = this.getLocation(from).unit;
        this.getLocation(from).unit = null;

        return {
            distanceMoved: {
                xy: xyMovementCost,
                z: this.getLocation(to).height - this.getLocation(from).height,
            },
            movementUsed: totalMovementCost,
        }
    }
}

export type MovementResult = {
    distanceMoved: {
        xy: number,
        z: number,
    },
    movementUsed: number,
}

export function generateRandom(width: number, length: number, maxHeight: number): Map {
    const map = new Map(length, width);

    for (let i = 0; i < width; i++) {
        map.locations.push([]);
        for (let j = 0; j < length; j++) {
            let height: number = randInt(1, maxHeight);
            map.locations[i].push(new Location(i, j, height, randomTerrainType()));
        }
    }

    return map;
}

function randomTerrainType(): TerrainType.Terrain {
    switch (randomProperty(TerrainType.Type)) {
        case TerrainType.Type.Dirt:
            return new Dirt();
        case TerrainType.Type.Grass:
            return new Grass();
        case TerrainType.Type.Snow:
            return new Snow();
        default:
            throw new Error('Invalid TerrainType.Type requested.');
    }
}

export function render(map: Map, scene: Scene) {
    for (let row of map.locations) {
        for (let location of row) {
            scene.add(location.mesh);
        }
    }
}