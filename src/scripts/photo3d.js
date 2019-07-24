import '../styles/photo3d.scss';

import * as THREE from 'three';
import * as CANNON from 'cannon';

import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { TeapotBufferGeometry } from '../jsm/geometries/TeapotBufferGeometry.js';

var world, mass, body, shape, timeStep=1/60;
var meshes=[];
var physicsBodies=[];
var camera, scene, renderer, geometry, material, mesh;
initThree();
initCannon();
animate();

function initCannon() {
  // Init physics
  world = new CANNON.World();
  world.broadphase = new CANNON.NaiveBroadphase();
  world.gravity.set(0,-10,0);
  world.solver.tolerance = 0.001;

  // Ground plane
  var plane = new CANNON.Plane();
  var groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(plane);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  world.add(groundBody);

  // Create N cubes
  var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
  for(var i=0; i!==20; i++){
      var body = new CANNON.Body({ mass: 1 });
      body.addShape(shape);
      body.position.set(Math.random()-0.5,2.5*i+0.5,Math.random()-0.5);
      world.add(body);
      physicsBodies.push(body);
  }
}


function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000 );
  camera.position.set(Math.cos( Math.PI/5 ) * 30,
                      5,
                      Math.sin( Math.PI/5 ) * 30);
  scene.add( camera );

  // lights
  var light, materials;
  scene.add( new THREE.AmbientLight( 0x666666 ) );

  light = new THREE.DirectionalLight( 0xffffff, 1.75 );
  var d = 20;

  light.position.set( d, d, d );

  light.castShadow = true;
  //light.shadowCameraVisible = true;

  light.shadowMapWidth = 1024;
  light.shadowMapHeight = 1024;

  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;

  light.shadowCameraFar = 3*d;
  light.shadowCameraNear = d;
  light.shadowDarkness = 0.5;

  scene.add( light );

  let plane_geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
  //geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
  material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
  //THREE.ColorUtils.adjustHSV( material.color, 0, 0, 0.9 );
  let ground_plane = new THREE.Mesh( plane_geometry, material );
  ground_plane.castShadow = false;
  ground_plane.receiveShadow = true;

  scene.add( ground_plane );

  var cubeGeo = new THREE.BoxGeometry( 1, 1, 1, 10, 10 );
  var cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );
  for(var i=0; i<20; i++){
    let cubeMesh = new THREE.Mesh( cubeGeo, cubeMaterial );
    cubeMesh.castShadow = true;
    scene.add( cubeMesh );
    meshes.push(cubeMesh);
  }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}
function animate() {
 requestAnimationFrame( animate );
 updatePhysics();
 render();
}
function updatePhysics() {

  debugger;
 // Step the physics world
 world.step(timeStep);

 // Copy coordinates from Cannon.js to Three.js
 for(var i = 0; i  <20; i++){
  meshes[i].position.copy( physicsBodies[i].position );
  meshes[i].quaternion.copy( physicsBodies[i].quaternion );
 }
}
function render() {
 renderer.render( scene, camera );
}