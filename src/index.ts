import * as THREE from 'three';
import * as Grid from "./Grid/Grid";
import {BasicUnit} from "./Unit/Unit";

declare global {
    interface Window { grid: Grid.Grid }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const xTiles = 10;
const yTiles = 5;
const maxHeight = 5;

window.grid = Grid.generateRandom(scene, xTiles, yTiles, maxHeight);
const unit = new BasicUnit(0xff0000);
scene.add(unit.mesh);
window.grid.placeUnit(5, 2, unit);

camera.position.x = xTiles / 2;
camera.position.y = -5;
camera.position.z = maxHeight * .5;

camera.lookAt(xTiles/2, yTiles/2, maxHeight/2);

window.grid.locations[5][2].mesh.material['transparent'] = false;
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();