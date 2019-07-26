import '../styles/photo3d.scss';
import '../assets/gltf/SimpleSkinning.gltf';

import * as THREE from 'three';
import * as CANNON from 'cannon';

import { GUI } from '../jsm/libs/dat.gui.module.js';
import { TeapotBufferGeometry } from '../jsm/geometries/TeapotBufferGeometry.js';

import { TrackballControls } from '../jsm/controls/TrackballControls.js';
import { DragControls } from '../jsm/controls/DragControls.js';
import {OrthographicTrackballControls} from '../jsm/controls/OrthographicTrackballControls';
      
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

var stats, mixer, camera, scene, renderer, clock, controls;
var frustumSize;
var objects;
init();
animate();

function init() {

  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 70, 100 );

  frustumSize = 100;
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
  camera.updateProjectionMatrix();
  camera.position.set( 0, 8, 0 );
  camera.lookAt(scene.position); 

  clock = new THREE.Clock();

  // ground

  var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
  var material = new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } );

  var ground = new THREE.Mesh( geometry, material );
  ground.position.set( 0, - 5, 0 );
  ground.rotation.x = - Math.PI / 2;
  ground.receiveShadow = true;
  scene.add( ground );

  var grid = new THREE.GridHelper( 500, 100, 0x000000, 0x000000 );
  grid.position.y = - 5;
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add( grid );

  // lights

  var light = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.6 );
  light.position.set( 0, 200, 0 );
  scene.add( light );

  light = new THREE.DirectionalLight( 0xffffff, 0.8 );
  light.position.set( 0, 20, 10 );
  light.castShadow = true;
  light.shadow.camera.top = 18;
  light.shadow.camera.bottom = - 10;
  light.shadow.camera.left = - 12;
  light.shadow.camera.right = 12;
  scene.add( light );

  //
  objects = [];
  var loader = new GLTFLoader();
  loader.load( '../src/assets/gltf/SimpleSkinning.gltf', function ( gltf ) {
    scene.add( gltf.scene );
    gltf.scene.traverse( function ( child ) {
      if ( child.isSkinnedMesh ) child.castShadow = true;
    } );
    mixer = new THREE.AnimationMixer( gltf.scene );
    mixer.clipAction( gltf.animations[ 0 ] ).play();
    objects.push(gltf.scene);
  });

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );

  //


  controls = new OrthographicTrackballControls( camera, renderer.domElement );
  controls.noRotate = true;
  controls.zoomSpeed = 0.01;
  controls.noPan = true;

  var dragControls = new DragControls( objects, camera, renderer.domElement );
  dragControls.addEventListener( 'dragstart', function () {
    controls.enabled = false;
  } );
  dragControls.addEventListener( 'dragend', function () {
    controls.enabled = true;
  } );


  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  var aspect = window.innerWidth / window.innerHeight;

  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  controls.update();
  requestAnimationFrame( animate );
  if ( mixer ) mixer.update( clock.getDelta() );
  render();
  //stats.update();
}

function render() {
  
  renderer.render( scene, camera );

}
