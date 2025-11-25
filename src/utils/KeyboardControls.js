import * as THREE from 'three';

export class KeyboardControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement || document.body;

        this.moveSpeed = 5.0;
        this.turnSpeed = 2.0;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            turnLeft: false,
            turnRight: false
        };

        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
            case 'ArrowLeft': this.keys.turnLeft = true; break;
            case 'ArrowRight': this.keys.turnRight = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
            case 'ArrowLeft': this.keys.turnLeft = false; break;
            case 'ArrowRight': this.keys.turnRight = false; break;
        }
    }

    update(delta) {
        // Movement logic
        const actualMoveSpeed = delta * this.moveSpeed;
        const actualTurnSpeed = delta * this.turnSpeed;

        if (this.keys.forward) {
            this.camera.translateZ(-actualMoveSpeed);
        }
        if (this.keys.backward) {
            this.camera.translateZ(actualMoveSpeed);
        }
        if (this.keys.left) {
            this.camera.translateX(-actualMoveSpeed);
        }
        if (this.keys.right) {
            this.camera.translateX(actualMoveSpeed);
        }

        // Rotation logic (Y-axis only for simple walking)
        if (this.keys.turnLeft) {
            this.camera.rotation.y += actualTurnSpeed;
        }
        if (this.keys.turnRight) {
            this.camera.rotation.y -= actualTurnSpeed;
        }

        // Keep camera at eye level (simple constraint)
        this.camera.position.y = 1.6;
    }
}
