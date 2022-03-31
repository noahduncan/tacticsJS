import * as TerrainType from './TerrainType';
import {MeshBasicMaterial} from "three";
import {TransparentMaterialConfig} from "./TerrainType";

const color: number = 0xfefefe;
const materialConfig = new TransparentMaterialConfig(color);
export default class Snow implements TerrainType.Terrain {
    material = new MeshBasicMaterial(materialConfig);
    name = TerrainType.Type.Snow;
}