/// <reference path="TerrainType.ts" />
namespace TerrainType {
    const color: number = 0x228B22;
    const material: THREE.Material = new THREE.MeshBasicMaterial({color: color})
    export class Grass implements Terrain {
        name(): Type {
            return TerrainType.Type.Grass;
        }
        material(): THREE.Material {
            return material;
        }
    }
}