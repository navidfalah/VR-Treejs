import * as THREE from 'three';

export class CarModel {
    constructor() {
        this.mesh = new THREE.Group();
        this.createCar();
    }

    createCar() {
        // Car Body (Chassis)
        const chassisGeometry = new THREE.BoxGeometry(2, 0.8, 4.5);
        const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.3, metalness: 0.7 }); // Blue metallic
        const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
        chassis.position.y = 0.8;
        this.mesh.add(chassis);

        // Car Top (Cabin)
        const cabinGeometry = new THREE.BoxGeometry(1.8, 0.7, 2.5);
        const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x0000aa, roughness: 0.3, metalness: 0.7 });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = 1.55;
        cabin.position.z = -0.2;
        this.mesh.add(cabin);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

        const wheelPositions = [
            { x: -1, y: 0.4, z: 1.5 },
            { x: 1, y: 0.4, z: 1.5 },
            { x: -1, y: 0.4, z: -1.5 },
            { x: 1, y: 0.4, z: -1.5 }
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.castShadow = true;
            this.mesh.add(wheel);
        });

        // Headlights
        const lightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 0.5 });

        const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
        leftLight.rotation.x = Math.PI / 2;
        leftLight.position.set(-0.6, 0.9, 2.26);
        this.mesh.add(leftLight);

        const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
        rightLight.rotation.x = Math.PI / 2;
        rightLight.position.set(0.6, 0.9, 2.26);
        this.mesh.add(rightLight);

        // Windows (Simple black planes)
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, metalness: 0.9 });

        // Front Windshield
        const frontWindow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), windowMaterial);
        frontWindow.position.set(0, 1.55, 1.06);
        frontWindow.rotation.x = -Math.PI / 6; // Slanted
        // Adjust cabin to fit slant if needed, or just place it on surface
        // For simple primitives, just placing on front face of cabin
        frontWindow.position.set(0, 1.55, 1.06);
        frontWindow.rotation.x = 0; // Flat for box cabin
        // Let's actually make it slightly better by just coloring the faces of the cabin if we could, 
        // but adding planes is easier for "add-on" look.

        // Let's stick to simple box cabin for now, maybe add a bumper.
        const bumperGeometry = new THREE.BoxGeometry(2.1, 0.2, 0.2);
        const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.set(0, 0.5, 2.3);
        this.mesh.add(frontBumper);

        const rearBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        rearBumper.position.set(0, 0.5, -2.3);
        this.mesh.add(rearBumper);

        this.mesh.castShadow = true;
        this.mesh.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
}
