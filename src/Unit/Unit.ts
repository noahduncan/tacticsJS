import * as THREE from "three";
import {MeshBasicMaterial, MeshMatcapMaterial} from "three";

interface Armor {
    physicalDefense: number,
    movement: number,
    magicDefense: number,
    weight: number,
}

interface Helmet {
    physicalDefense: number,
    magicDefense: number,
    weight: number,
}

enum WeaponType {
    Ranged,
    Melee,
}

interface Weapon {
    physicalAttack: number,
    magicAttack: number,
    weight: number,
    range: number,
    type: WeaponType,
}

interface Shoes {
    jump: number,
    movement: number,
    weight: number,
}

class EquipmentSlots {
    head?: Helmet;
    body?: Armor;
    leftArm?: Weapon;
    rightArm?: Weapon;
    legs?: Armor;
    feet?: Shoes;
}

export abstract class Unit {
    movement: number;
    equipment: EquipmentSlots;
    mesh: THREE.Mesh;

    constructor(color: number) {
        this.generateMesh(color)
    }

    private generateMesh(color: number) {
        const geometry = new THREE.SphereGeometry(0.25, 16, 8);
        geometry.translate(0.5, 0.5, 0.5); // Center the sphere in the middle of the grid cube.
        const material = new MeshMatcapMaterial({color: color});

        this.mesh = new THREE.Mesh(geometry, material);

        const geo = new THREE.EdgesGeometry(this.mesh.geometry);
        const mat = new THREE.LineBasicMaterial( { color: 0x0000000 } );
        const wireframe = new THREE.LineSegments( geo, mat);
        this.mesh.add(wireframe);
    }
}

abstract class BaseBodyArmor implements Armor {
    physicalDefense = 1;
    magicDefense = 0;
    movement = 0;
    weight = 0;
}

abstract class BaseLegArmor implements Armor {
    physicalDefense = 0;
    magicDefense = 0;
    movement = 0;
    weight = 0;
}

class TShirt extends BaseBodyArmor {
}

class AirJordans implements Shoes {
    jump: 2;
    movement: 1;
    weight: 1;
}

class BlueJeans extends BaseLegArmor {
    physicalDefense = 2;
    weight = 2;
}

class NoHelmet implements Helmet {
    physicalDefense = 0;
    magicDefense = 0;
    weight: 0;
}

class NoWeapon implements Weapon {
    type = WeaponType.Melee;
    weight = 0;
    physicalAttack = 0;
    magicAttack = 0;
    range = 1;
}

export class BasicUnit extends Unit {
    movement = 10;
    equipment = {
        head: new NoHelmet(),
        body: new TShirt(),
        leftArm: new NoWeapon(),
        rightArm: new NoWeapon(),
        legs: new BlueJeans(),
        feet: new AirJordans(),
    };
}
