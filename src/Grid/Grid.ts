// A grid is made up of tiles.
// Tiles are composed of a terrain type.
// Tiles may have a modifier: e.g. difficult terrain or impassible.
// Terrain types have a three.js material.
// Terrain Types may have a modifier: e.g. difficult terrain or impassible.

/// <reference path="TerrainTypes/TerrainType.ts" />
import {randInt} from "three/src/math/MathUtils";
import * as THREE from "three";

class Location {
    height: number;
    // terrainType: TerrainType.Terrain;
    geometry: THREE.BoxGeometry;
    mesh: THREE.Mesh;

    constructor(height: number) {
        this.height = height;
        this.geometry = new THREE.BoxGeometry(1, 1, 0.5*height);
        this.geometry.translate(0.5, 0.5, 0.25*height);
        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
        }));

        const geo = new THREE.EdgesGeometry(this.mesh.geometry);
        const mat = new THREE.LineBasicMaterial( { color: 0x0000000 } );
        const wireframe = new THREE.LineSegments( geo, mat);
        this.mesh.add(wireframe);
        // this.terrainType = terrainType;
    }

    // get material() {
    //     return this.terrainType.material();
    // }
}

export default class Grid {
    grid: Array<Array<Location>> = [];
    width: number;
    length: number;
    maxHeight: number;
    constructor(width: number, length: number, maxHeight: number) {
        this.width = width;
        this.length = length;
        this.maxHeight = maxHeight;
        this.initRandom();
    }

    initRandom() {
        for (let i = 0; i < this.width; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.length; j++) {
                let height: number = randInt(1, this.maxHeight);
                // let terrainType: TerrainType.Terrain;
                // switch(randInt(0,1)) {
                //     case TerrainType.Type.Dirt:
                //         terrainType = new TerrainType.Dirt();
                //         break;
                //     case TerrainType.Type.Grass:
                //         terrainType = new TerrainType.Grass();
                //         break;
                //     default:
                //         throw new Error('Invalid TerrainType.Type requested.');
                // }
                const location = new Location(height);
                this.grid[i].push(location);
            }
        }
    }
}