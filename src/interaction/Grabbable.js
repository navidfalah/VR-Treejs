import * as THREE from 'three';

export class Grabbable {
    constructor(scene, controllers) {
        this.scene = scene;
        this.controllers = controllers;
        this.grabbables = [];

        this.raycaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();

        this.setupInput();
    }

    add(object) {
        this.grabbables.push(object);
        object.userData.isGrabbable = true;
        object.userData.originalParent = object.parent;
    }

    setupInput() {
        this.controllers.forEach(controller => {
            controller.addEventListener('selectstart', this.onSelectStart.bind(this));
            controller.addEventListener('selectend', this.onSelectEnd.bind(this));
        });
    }

    onSelectStart(event) {
        const controller = event.target;

        // Check for intersection
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

        const intersects = this.raycaster.intersectObjects(this.grabbables, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            // Find the root grabbable object (in case we hit a child)
            let grabObject = object;
            while (grabObject.parent && !grabObject.userData.isGrabbable && grabObject !== this.scene) {
                grabObject = grabObject.parent;
            }

            if (grabObject.userData.isGrabbable) {
                this.grab(controller, grabObject);
            }
        }
    }

    onSelectEnd(event) {
        const controller = event.target;
        if (controller.userData.grabbedObject) {
            this.release(controller);
        }
    }

    grab(controller, object) {
        // If already grabbed, release first
        if (object.userData.grabbedBy) {
            this.release(object.userData.grabbedBy);
        }

        controller.userData.grabbedObject = object;
        object.userData.grabbedBy = controller;

        // Attach to controller
        this.scene.attach(object); // Detach from world
        controller.attach(object); // Attach to controller

        // Optional: Feedback
        if (controller.gamepad && controller.gamepad.hapticActuators && controller.gamepad.hapticActuators[0]) {
            controller.gamepad.hapticActuators[0].pulse(0.5, 100);
        }
    }

    release(controller) {
        const object = controller.userData.grabbedObject;
        if (object) {
            this.scene.attach(object); // Re-attach to scene

            controller.userData.grabbedObject = null;
            object.userData.grabbedBy = null;
        }
    }

    // --- Mouse Interaction ---

    grabWithMouse(camera, mouseEvent) {
        // 1. Raycast from camera
        const mouse = new THREE.Vector2();
        mouse.x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, camera);
        const intersects = this.raycaster.intersectObjects(this.grabbables, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            // Find root grabbable
            let grabObject = object;
            while (grabObject.parent && !grabObject.userData.isGrabbable && grabObject !== this.scene) {
                grabObject = grabObject.parent;
            }

            if (grabObject.userData.isGrabbable) {
                this.grabMouse(camera, grabObject);
                return true; // Success
            }
        }
        return false;
    }

    grabMouse(camera, object) {
        // If already grabbed, release first
        if (object.userData.grabbedBy) {
            // If grabbed by controller, release from controller
            // If grabbed by camera (mouse), release from camera
            this.release(object.userData.grabbedBy);
        }

        // We use the camera as the "controller" for mouse interaction
        // But we need a holder object slightly in front of the camera
        if (!camera.userData.holder) {
            camera.userData.holder = new THREE.Object3D();
            camera.userData.holder.position.set(0.3, -0.3, -1); // Down and right, in front
            camera.add(camera.userData.holder);
        }

        camera.userData.grabbedObject = object;
        object.userData.grabbedBy = camera;

        // Attach to camera holder
        camera.userData.holder.attach(object);
    }

    releaseMouse(camera) {
        const object = camera.userData.grabbedObject;
        if (object) {
            this.scene.attach(object);
            camera.userData.grabbedObject = null;
            object.userData.grabbedBy = null;

            // Optional: Place on ground if close? 
            // For now just detaching leaves it in mid-air/wherever it was relative to camera
            // Let's ensure it's upright-ish? No, leave as is for physics-less sim.
        }
    }
}
