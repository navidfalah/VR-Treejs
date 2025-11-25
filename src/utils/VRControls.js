import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export class VRControls {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.controllers = [];
        this.controllerGrips = [];

        this.raycaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();
        this.workingMatrix = new THREE.Matrix4();
        this.origin = new THREE.Vector3();

        this.setupControllers();
    }

    setupControllers() {
        const controllerModelFactory = new XRControllerModelFactory();

        // Controller 0
        const controller0 = this.renderer.xr.getController(0);
        controller0.addEventListener('selectstart', this.onSelectStart.bind(this));
        controller0.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.scene.add(controller0);
        this.controllers.push(controller0);

        const controllerGrip0 = this.renderer.xr.getControllerGrip(0);
        controllerGrip0.add(controllerModelFactory.createControllerModel(controllerGrip0));
        this.scene.add(controllerGrip0);
        this.controllerGrips.push(controllerGrip0);

        // Controller 1
        const controller1 = this.renderer.xr.getController(1);
        controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
        controller1.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.scene.add(controller1);
        this.controllers.push(controller1);

        const controllerGrip1 = this.renderer.xr.getControllerGrip(1);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        this.scene.add(controllerGrip1);
        this.controllerGrips.push(controllerGrip1);

        // Laser pointer for controllers
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;

        controller0.add(line.clone());
        controller1.add(line.clone());
    }

    onSelectStart(event) {
        const controller = event.target;
        controller.userData.isSelecting = true;
    }

    onSelectEnd(event) {
        const controller = event.target;
        controller.userData.isSelecting = false;
    }

    getIntersections(objects) {
        this.tempMatrix.identity().extractRotation(this.controllers[0].matrixWorld);

        this.raycaster.ray.origin.setFromMatrixPosition(this.controllers[0].matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

        return this.raycaster.intersectObjects(objects, true);
    }
}
