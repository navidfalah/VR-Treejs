import * as THREE from 'three';

export class Props {
    constructor(scene) {
        this.scene = scene;
        this.cone = null;
        this.phone = null;

        this.createCone();
        this.createPhone();
    }

    createCone() {
        this.cone = new THREE.Group();
        this.cone.name = "SafetyCone";

        const coneGeo = new THREE.ConeGeometry(0.2, 0.6, 32);
        const coneMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        const coneMesh = new THREE.Mesh(coneGeo, coneMat);
        coneMesh.position.y = 0.3;
        coneMesh.castShadow = true;
        this.cone.add(coneMesh);

        const baseGeo = new THREE.BoxGeometry(0.4, 0.05, 0.4);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = 0.025;
        baseMesh.castShadow = true;
        this.cone.add(baseMesh);

        // Position directly in front of player start (0, 0, 3)
        this.cone.position.set(0, 0, 1);
        this.scene.add(this.cone);
    }

    createPhone() {
        this.phone = new THREE.Group();
        this.phone.name = "Phone";

        const bodyGeo = new THREE.BoxGeometry(0.07, 0.14, 0.01);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        this.phone.add(body);

        const screenGeo = new THREE.PlaneGeometry(0.06, 0.12);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Screen off
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.006;
        this.phone.add(screen);

        // Position on sidewalk
        this.phone.position.set(-5, 0.8, 2); // Floating slightly or on a prop?
        // Let's put it on the ground for now, or maybe on a "bench" if we had one.
        // Ground is fine.
        this.phone.position.set(-5, 0.1, 2);
        this.phone.rotation.x = -Math.PI / 2;

        this.scene.add(this.phone);
    }
}
