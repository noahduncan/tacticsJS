/// <reference path="TerrainType.ts" />
namespace TerrainType {
    const color: number = 0x8B4513;
    const material: THREE.Material = new THREE.MeshBasicMaterial({color: color})
    export class Dirt implements Terrain {
        name(): Type {
            return TerrainType.Type.Dirt;
        }
        material(): THREE.Material {
            return material;
        }
    }
}