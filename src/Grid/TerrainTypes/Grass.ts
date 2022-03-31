import * as TerrainType from './TerrainType';
import {MeshBasicMaterial} from "three";
import {TransparentMaterialConfig} from "./TerrainType";

const color: number = 0x228B22;
const materialConfig = new TransparentMaterialConfig(color);
export default class Grass implements TerrainType.Terrain {
    material = new MeshBasicMaterial(materialConfig);
    readonly name = TerrainType.Type.Grass;
}