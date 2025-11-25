import * as THREE from 'three';

export class HumanModel {
    constructor() {
        this.mesh = new THREE.Group();
        this.createHuman();
    }

    createHuman() {
        const skinColor = 0xffccaa;
        const shirtColor = 0xeeeeee;
        const pantsColor = 0x333399;

        // Head
        const headGeometry = new THREE.BoxGeometry(0.25, 0.3, 0.25);
        const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.75;
        head.castShadow = true;
        this.mesh.add(head);

        // Body (Torso)
        const bodyGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.3);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25;
        body.castShadow = true;
        this.mesh.add(body);

        // Arms
        const armGeometry = new THREE.BoxGeometry(0.15, 0.7, 0.15);
        const armMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.35, 1.25, 0);
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.35, 1.25, 0);
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.2, 0.85, 0.2);
        const legMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, 0.45, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, 0.45, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);
    }

    setPose(poseName) {
        if (poseName === 'injured') {
            // Rotate entire group to lie down
            this.mesh.rotation.x = -Math.PI / 2;
            this.mesh.rotation.z = Math.PI / 4;
            this.mesh.position.y = 0.2; // Slightly above ground

            // Could add more specific limb rotations here if we stored references
        }
    }
}
