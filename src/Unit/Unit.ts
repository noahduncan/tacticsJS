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

type UnitStats = {
    physicalAttackPower: number;
    magicAttackPower: number;
    physicalDefense: number;
    magicDefense: number;
    movement: number;
    jump: number;
    weight: number;
}

export abstract class Unit {
    jump: number;
    movement: number;
    equipment: EquipmentSlots = {
        head: new NoHelmet(),
        body: new TShirt(),
        leftArm: new NoWeapon(),
        rightArm: new NoWeapon(),
        legs: new BlueJeans(),
        feet: new AirJordans(),
    };
    mesh: THREE.Mesh;
    stats: UnitStats = {
        physicalAttackPower: 0,
        magicAttackPower: 0,
        physicalDefense: 0,
        magicDefense: 0,
        movement: 0,
        jump: 0,
        weight: 0,
    };

    constructor(color: number) {
        this.generateMesh(color);
        this.updateStats();
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

    updateStats() {
        this.stats = {
            physicalAttackPower: Math.max(this.equipment.leftArm.physicalAttack, this.equipment.rightArm.physicalAttack),
            magicAttackPower: Math.max(this.equipment.leftArm.magicAttack, this.equipment.rightArm.magicAttack),
            physicalDefense: this.equipment.head.physicalDefense + this.equipment.body.physicalDefense,
            magicDefense: this.equipment.head.magicDefense + this.equipment.body.magicDefense,
            movement: this.movement + this.equipment.feet.movement + this.equipment.body.movement + this.equipment.legs.movement,
            jump: this.jump + this.equipment.feet.jump,
            weight: this.equipment.head.weight + this.equipment.body.weight + this.equipment.leftArm.weight + this.equipment.rightArm.weight + this.equipment.legs.weight + this.equipment.feet.weight,
        }
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
    jump = 2;
    movement = 1;
    weight = 1;
}

class BlueJeans extends BaseLegArmor {
    physicalDefense = 2;
    weight = 2;
}

class NoHelmet implements Helmet {
    physicalDefense = 0;
    magicDefense = 0;
    weight = 0;
}

class NoWeapon implements Weapon {
    type = WeaponType.Melee;
    weight = 0;
    physicalAttack = 0;
    magicAttack = 0;
    range = 1;
}

export class BasicUnit extends Unit {
    jump = 0;
    movement = 10;
    equipment = {
        head: new NoHelmet(),
        body: new TShirt(),
        leftArm: new NoWeapon(),
        rightArm: new NoWeapon(),
        legs: new BlueJeans(),
        feet: new AirJordans(),
    };
    constructor(color: number) {
        super(color);
        this.updateStats();
    }
}
