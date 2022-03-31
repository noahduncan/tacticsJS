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
import {BasicUnit, Unit} from "../Unit/Unit";

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

export class Grid {
    locations: Array<Array<Location>> = [];
    width: number;
    length: number;
    constructor(width: number, length: number) {
        this.width = width;
        this.length = length;
    }

    placeUnit(x: number, y: number, unit: Unit|null) {
        let location = this.locations[x][y];
        if (location.unit !== null) {
            throw new Error('Cannot place unit, location is already occupied.');
        }
        location.unit = unit;
        unit.mesh.position.x = x;
        unit.mesh.position.y = y;
        unit.mesh.position.z = location.height;
    }
}

export function generateRandom(scene: THREE.Scene, width: number, length: number, maxHeight: number): Grid {
    const grid = new Grid(length, width);

    for (let i = 0; i < width; i++) {
        grid.locations.push([]);
        for (let j = 0; j < length; j++) {
            let height: number = randInt(1, maxHeight);
            let terrain: TerrainType.Terrain;
            switch(randomProperty(TerrainType.Type)) {
                case TerrainType.Type.Dirt:
                    terrain = new Dirt();
                    break;
                case TerrainType.Type.Grass:
                    terrain = new Grass();
                    break;
                case TerrainType.Type.Snow:
                    terrain = new Snow();
                    break;
                default:
                    throw new Error('Invalid TerrainType.Type requested.');
            }
            const location = new Location(i, j, height, terrain);
            grid.locations[i].push(location);
            scene.add(location.mesh);
        }
    }

    return grid;
}