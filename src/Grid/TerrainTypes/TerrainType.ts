namespace TerrainType {
    export interface Terrain {
        name(): Type;
        material(): THREE.Material;
    }
    export enum Type {
        Dirt,
        Grass,
    }
}
