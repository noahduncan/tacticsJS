import * as TerrainType from './TerrainType';
import {Material, MeshBasicMaterial} from "three";

const color: number = 0xfefefe;
const materialConfig = {
    color: color,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    opacity:0.25,
    transparent: true,
};
export default class Snow implements TerrainType.Terrain {
    material: Material;
    name = TerrainType.Type.Snow;
    constructor() {
        this.material = new MeshBasicMaterial(materialConfig);
    }
}