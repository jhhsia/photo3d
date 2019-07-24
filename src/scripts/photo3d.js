import '../styles/photo3d.scss';
import '../assets/gltf/SimpleSkinning.gltf';

import * as THREE from 'three';
import * as CANNON from 'cannon';

import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { TeapotBufferGeometry } from '../jsm/geometries/TeapotBufferGeometry.js';

import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

var stats, mixer, camera, scene, renderer, clock;

init();
animate();

function init() {

  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 24, 8, 24 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 70, 100 );

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

  var loader = new GLTFLoader();
  loader.load( '../src/assets/gltf/SimpleSkinning.gltf', function ( gltf ) {

    scene.add( gltf.scene );

    gltf.scene.traverse( function ( child ) {

      if ( child.isSkinnedMesh ) child.castShadow = true;

    } );

    mixer = new THREE.AnimationMixer( gltf.scene );
    mixer.clipAction( gltf.animations[ 0 ] ).play();

  } );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );

  //

  var controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 50;

}

function animate() {

  requestAnimationFrame( animate );

  if ( mixer ) mixer.update( clock.getDelta() );

  render();
  //stats.update();

}

function render() {

  renderer.render( scene, camera );

}
