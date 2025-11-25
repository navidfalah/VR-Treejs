
import * as THREE from 'three';
import { GameUI } from './GameUI.js';
import { VRControls } from '../utils/VRControls.js';
import { Teleportation } from '../utils/Teleportation.js';
import { HumanModel } from '../scene/HumanModel.js';
import { Grabbable } from '../interaction/Grabbable.js';
import { Props } from '../scene/Props.js';

export class GameManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.state = 'START'; // START, ASSESS, ACTION, RESULT, END

        this.ui = new GameUI(scene, camera);
        this.controls = new VRControls(renderer, scene, camera);
        this.teleportation = new Teleportation(scene, camera, renderer, this.controls.controllers);
        this.grabbable = new Grabbable(scene, this.controls.controllers);

        this.props = new Props(scene);
        this.grabbable.add(this.props.cone);
        this.grabbable.add(this.props.phone);

        this.interactiveObjects = [];
        this.victim = null;

        this.init();
    }

    init() {
        console.log('Game Initialized');
        this.createVictim();
        this.createHintArrow();
        this.setState('START');

        // Add event listener for controller select
        this.controls.controllers.forEach(controller => {
            controller.addEventListener('select', this.handleInput.bind(this));
        });

        // Add mouse click for non-VR debugging
        window.addEventListener('click', this.handleInput.bind(this));
    }

    createHintArrow() {
        // Floating arrow pointing down
        const geometry = new THREE.ConeGeometry(0.1, 0.3, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.arrow = new THREE.Mesh(geometry, material);
        this.arrow.rotation.x = Math.PI; // Point down
        this.scene.add(this.arrow);
        this.arrow.visible = false;
    }

    createVictim() {
        this.victim = new HumanModel();
        this.victim.setPose('injured');
        this.victim.mesh.position.set(2, 0, -3);

        this.scene.add(this.victim.mesh);
        this.interactiveObjects.push(this.victim.mesh);
    }

    setTeleportFloor(floor) {
        this.teleportation.setFloor(floor);
    }

    setState(newState) {
        this.state = newState;
        console.log('State:', this.state);

        switch (this.state) {
            case 'START':
                this.ui.createMessage("Accident Scenario\nClick to Start");
                break;
            case 'ASSESS':
                this.ui.createMessage("Step 1: Secure Area\nGrab the Safety Cone and place it near the accident.");
                break;
            case 'ACTION':
                this.ui.createMessage("Step 2: Check Victim\nWalk close to the victim to check them.");
                break;
            case 'RESULT':
                this.ui.createMessage("Victim Unresponsive!\nFind the Phone and call 911.");
                break;
            case 'END':
                this.ui.createMessage("Scenario Complete.\nGood job!");
                break;
        }
    }

    handleInput(event) {
        // Prevent teleportation from triggering game state if selecting floor
        if (this.teleportation.isSelecting) return;

        // Simple state transition for START
        if (this.state === 'START') {
            this.setState('ASSESS');
            return;
        }

        // Mouse Interaction (Desktop)
        if (event.type === 'click') {
            // Check if we are holding something
            if (this.camera.userData.grabbedObject) {
                this.grabbable.releaseMouse(this.camera);
            } else {
                // Try to grab
                const grabbed = this.grabbable.grabWithMouse(this.camera, event);
                if (grabbed) return; // Don't process other clicks if we grabbed something
            }
        }
    }

    checkProximity(object1, object2, distance) {
        if (!object1 || !object2) return false;
        // Handle Groups vs Meshes
        const pos1 = new THREE.Vector3();
        const pos2 = new THREE.Vector3();
        object1.getWorldPosition(pos1);
        object2.getWorldPosition(pos2);
        return pos1.distanceTo(pos2) < distance;
    }

    updateHint(target) {
        if (!target) {
            this.arrow.visible = false;
            return;
        }

        this.arrow.visible = true;
        const targetPos = new THREE.Vector3();
        target.getWorldPosition(targetPos);

        // Float above target
        this.arrow.position.set(targetPos.x, targetPos.y + 1.5, targetPos.z);

        // Bobbing animation
        const time = Date.now() * 0.005;
        this.arrow.position.y += Math.sin(time) * 0.1;
        this.arrow.rotation.y += 0.05;
    }

    update(delta) {
        this.ui.update();
        this.teleportation.update();

        // Update Hint based on state
        switch (this.state) {
            case 'ASSESS':
                this.updateHint(this.props.cone);
                break;
            case 'ACTION':
                this.updateHint(this.victim.mesh);
                break;
            case 'RESULT':
                this.updateHint(this.props.phone);
                break;
            default:
                this.updateHint(null);
                break;
        }

        // Game Logic Checks
        switch (this.state) {
            case 'ASSESS':
                // Check if Cone is near Victim
                if (this.checkProximity(this.props.cone, this.victim.mesh, 2.0)) {
                    // Ensure it's not currently grabbed
                    if (!this.props.cone.userData.grabbedBy) {
                        this.setState('ACTION');
                    }
                }
                break;
            case 'ACTION':
                // Check if Camera (User) is near Victim
                if (this.checkProximity(this.camera, this.victim.mesh, 1.5)) {
                    this.setState('RESULT');
                }
                break;
            case 'RESULT':
                // Check if Phone is grabbed (held to ear/head)
                if (this.props.phone.userData.grabbedBy) {
                    // Check if phone is near camera (head)
                    if (this.checkProximity(this.props.phone, this.camera, 0.3)) {
                        this.setState('END');
                    }
                }
                break;
        }
    }
}
