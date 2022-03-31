export interface Terrain {
    name: Type;
    material: THREE.Material;
}
export enum Type {
    Dirt='dirt',
    Grass='grass',
    Snow='snow',
}