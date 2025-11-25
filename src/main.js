import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { StreetScene } from './scene/StreetScene.js';
import { GameManager } from './game/GameManager.js';
import { KeyboardControls } from './utils/KeyboardControls.js';

// Initialize Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

// Initialize Camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3); // Average eye height

// Initialize Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Add VR Button
const vrButton = VRButton.createButton(renderer);
document.body.appendChild(vrButton);

// Hide "VR NOT SUPPORTED" message if desired
if ('xr' in navigator === false) {
    vrButton.style.display = 'none';
}

// Game Components
const streetScene = new StreetScene(scene);
const gameManager = new GameManager(scene, camera, renderer);
const keyboardControls = new KeyboardControls(camera, renderer.domElement);

// Setup Teleportation Floor
gameManager.setTeleportFloor(streetScene.floor);

// Handle Window Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
renderer.setAnimationLoop(function () {
    const delta = 0.016; // Approx 60fps
    streetScene.update(delta);
    gameManager.update(delta);

    // Only use keyboard controls if NOT in VR (or if desired in VR too, but usually not)
    if (!renderer.xr.isPresenting) {
        keyboardControls.update(delta);
    }

    renderer.render(scene, camera);
});
