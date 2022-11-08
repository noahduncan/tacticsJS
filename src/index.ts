import * as THREE from 'three';
import * as Map from "./Grid/Map";
import {BasicUnit, Unit} from "./Unit/Unit";
import {Material} from "three";
import {GUI} from 'dat.gui';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

declare global {
    interface Window { map: Map.Map, unit: Unit }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const maxHeight = 5;

const map = window.map = Map.generate2DRamp(maxHeight);
const unit = window.unit = new BasicUnit(0xffd008);
Map.render(map, scene);
scene.add(window.unit.mesh);
map.placeUnit(new Map.Coordinate(5, 2), unit);

camera.position.x = map.width / 2;
camera.position.y = map.length / 2;;
camera.position.z = maxHeight * 1;

const target = new THREE.Vector3(map.width / 2, map.length / 2, maxHeight / 2);
camera.lookAt(target);
controls.target = target
controls.update();

let locationMaterial = <Material>map.locations[5][2].mesh.material;
// locationMaterial.transparent = false;
// locationMaterial.opacity = 1;

const gui = new GUI();
const unitFolder = gui.addFolder('Unit');
unitFolder.add(unit.stats, 'movement', 0, 1000, 1).listen();
unitFolder.open();

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event: KeyboardEvent) {
    let from = new Map.Coordinate(unit.mesh.position.x, unit.mesh.position.y);
    let to: Map.Coordinate;
    if (unit.stats.movement > 0) {
        switch (event.key) {
            case 'ArrowLeft':
                to = new Map.Coordinate(Math.max(0, from.x - 1), from.y);
                break;
            case 'ArrowRight':
                to = new Map.Coordinate(Math.min(map.width, from.x + 1), from.y)
                break;
            case 'ArrowDown':
                to = new Map.Coordinate(from.x, Math.max(0, from.y - 1));
                break;
            case 'ArrowUp':
                to = new Map.Coordinate(from.x, Math.min(map.length, from.y + 1));
                break;
        }
    }
    if (from != to) {
        map.moveUnit(from, to);
        locationMaterial.transparent = true;
        locationMaterial.opacity = 0.25;
        locationMaterial = <Material>map.locations[unit.mesh.position.x][unit.mesh.position.y].mesh.material;
        locationMaterial.transparent = false;
        locationMaterial.opacity = 1;
    }
}

animate();

/**
 * Game needs
 * 1. Initialization / animation handler
 * 2. Map
 * 3. Units
 * 4. Combat System
 * 5. Scenario management / win conditions
 * 6. Equipment
 * 7. Magic System
 * 8. Story line
 * 9. UI Manager
 */
