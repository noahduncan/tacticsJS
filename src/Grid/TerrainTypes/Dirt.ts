import * as TerrainType from './TerrainType';
import {Material, MeshBasicMaterial} from "three";

const color: number = 0x8B4513;
const materialConfig = {
    color: color,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    opacity:0.25,
    transparent: true,
}
export default class Dirt implements TerrainType.Terrain {
    material = new MeshBasicMaterial(materialConfig);
    readonly name = TerrainType.Type.Dirt;
}