export class BaseMaterialConfig {
    color = 0x000000;
    polygonOffset = true;
    polygonOffsetFactor = 1; // positive value pushes polygon further away
    polygonOffsetUnits = 1;

    constructor(color: number) {
        this.color = color;
    }
}

export class TransparentMaterialConfig extends BaseMaterialConfig{
    opacity = 0.25;
    transparent = true;
}
export interface Terrain {
    name: Type;
    material: THREE.Material;
}
export enum Type {
    Dirt='dirt',
    Grass='grass',
    Snow='snow',
}