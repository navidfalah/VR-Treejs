import * as THREE from 'three';

export class Teleportation {
    constructor(scene, camera, renderer, controllers) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controllers = controllers;

        this.raycaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();

        this.marker = null;
        this.floor = null; // Object to teleport onto
        this.isSelecting = false;

        this.initMarker();
        this.setupInput();
    }

    initMarker() {
        const geometry = new THREE.RingGeometry(0.2, 0.25, 32).rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.marker = new THREE.Mesh(geometry, material);
        this.marker.visible = false;
        this.scene.add(this.marker);
    }

    setFloor(floorMesh) {
        this.floor = floorMesh;
    }

    setupInput() {
        this.controllers.forEach(controller => {
            controller.addEventListener('selectstart', this.onSelectStart.bind(this));
            controller.addEventListener('selectend', this.onSelectEnd.bind(this));
        });
    }

    onSelectStart(event) {
        this.isSelecting = true;
    }

    onSelectEnd(event) {
        this.isSelecting = false;
        if (this.marker.visible) {
            this.teleportTo(this.marker.position);
            this.marker.visible = false;
        }
    }

    teleportTo(position) {
        // Move the camera rig (usually a group wrapping the camera)
        // Since we don't have a rig, we move the camera offset
        // But in WebXR, we usually move a "User" group.
        // For simplicity, we'll assume the camera is in a group or we offset the renderer reference space (complex).
        // EASIER WAY: Move the camera parent (if exists) or offset all scene objects (bad).
        // BEST WAY for simple Three.js VR: Use a camera group.

        // Let's check if camera has a parent that is not scene
        if (this.camera.parent && this.camera.parent !== this.scene) {
            const offset = new THREE.Vector3();
            offset.copy(position);

            // Keep height? Usually we teleport to floor level.
            // The camera local position has the eye height.
            // So we move the parent to the target x/z.

            this.camera.parent.position.set(offset.x, 0, offset.z);
        } else {
            // If camera is direct child of scene, we need to wrap it or use offset
            // We will handle this by ensuring camera is in a 'user' group in main.js or GameManager
            // For now, let's assume we can move the camera's parent.
            console.warn("Camera needs a parent group for teleportation to work correctly.");
        }
    }

    update() {
        if (this.isSelecting && this.floor) {
            // Check intersections
            // Use the first controller for now
            const controller = this.controllers[0];

            this.tempMatrix.identity().extractRotation(controller.matrixWorld);
            this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
            this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

            const intersects = this.raycaster.intersectObject(this.floor);

            if (intersects.length > 0) {
                this.marker.visible = true;
                this.marker.position.copy(intersects[0].point);
            } else {
                this.marker.visible = false;
            }
        }
    }
}
