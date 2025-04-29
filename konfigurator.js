import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, model, engravingMesh;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1ece7);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load('assets/models/schneidebrett.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
    updateEngraving();
  });

  document.getElementById('update').addEventListener('click', updateEngraving);
}

function updateEngraving() {
  const text = document.getElementById('engraving').value;

  if (engravingMesh) {
    model.remove(engravingMesh);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = '48px sans-serif';
  context.fillStyle = '#000000';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 16);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

  const geometry = new THREE.PlaneGeometry(1, 0.25);
  engravingMesh = new THREE.Mesh(geometry, material);
  engravingMesh.position.set(0, 0.01, 0); // Position anpassen je nach Modell
  model.add(engravingMesh);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
