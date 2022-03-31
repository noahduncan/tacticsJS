import * as THREE from 'three';
import * as Grid from "./Grid/Grid";
import {BasicUnit, Unit} from "./Unit/Unit";
import {Material} from "three";
import {GUI} from 'dat.gui';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

declare global {
    interface Window { grid: Grid.Grid, unit: Unit }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const xTiles = 10;
const yTiles = 5;
const maxHeight = 5;

const grid = window.grid = Grid.generateRandom(scene, xTiles, yTiles, maxHeight);
const unit = window.unit = new BasicUnit(0xff0000);
scene.add(window.unit.mesh);
grid.placeUnit(5, 2, unit);

camera.position.x = xTiles / 2;
camera.position.y = -5;
camera.position.z = maxHeight * .5;

camera.lookAt(xTiles/2, yTiles/2, maxHeight/2);
controls.update();

const locationMaterial = <Material>grid.locations[5][2].mesh.material;
locationMaterial.transparent = false;

const gui = new GUI();
const unitFolder = gui.addFolder('Unit');
unitFolder.add(unit.stats, 'movement', 0, 20, 1).listen();
unitFolder.open();

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event: KeyboardEvent) {
    let originalPosition = unit.mesh.position.clone();
    if (unit.stats.movement > 0) {
        switch (event.key) {
            case 'ArrowLeft':
                unit.mesh.position.x = Math.max(0, unit.mesh.position.x - 1);
                break;
            case 'ArrowRight':
                unit.mesh.position.x = Math.min(xTiles-1, unit.mesh.position.x + 1);
                break;
            case 'ArrowDown':
                unit.mesh.position.y = Math.max(0, unit.mesh.position.y - 1);
                break;
            case 'ArrowUp':
                unit.mesh.position.y = Math.min(yTiles-1, unit.mesh.position.y + 1);
                break;
        }
        unit.mesh.position.z = grid.locations[unit.mesh.position.x][unit.mesh.position.y].height;
    }
    if (!originalPosition.equals(unit.mesh.position)) {
        unit.stats.movement -= 1;
    }
}

animate();