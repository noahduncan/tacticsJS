import * as THREE from 'three';
import Grid from "./Grid/Grid";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry(1,1,0.5);
// geometry.translate(.5, 0.5, 0.25);
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
//
// const geo = new THREE.EdgesGeometry(cube.geometry);
// const mat = new THREE.LineBasicMaterial( { color: 0x0000000 } );
// const wireframe = new THREE.LineSegments( geo, mat);
// cube.add(wireframe);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const xTiles = 10;
const yTiles = 5;
const maxHeight = 5;
const grid = new Grid(xTiles,yTiles,maxHeight);
for (let x in grid.grid) {
    let row = grid.grid[x];
    for (let y in row) {
        let tile = row[y];
        tile.mesh.position.x = Number(x);
        tile.mesh.position.y = Number(y);
        scene.add(tile.mesh);
    }
}

camera.position.x = xTiles / 2;
camera.position.y = -yTiles / 2;
camera.position.z = maxHeight * 2;

camera.lookAt(xTiles/2, yTiles/2, maxHeight/2);

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();