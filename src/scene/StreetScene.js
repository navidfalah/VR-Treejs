import * as THREE from 'three';
import { CarModel } from './CarModel.js';

export class StreetScene {
    constructor(scene) {
        this.scene = scene;
        this.floor = null; // Reference for teleportation
        this.setupEnvironment();
        this.setupLighting();
    }

    setupEnvironment() {
        // --- Road ---
        const roadGeometry = new THREE.PlaneGeometry(10, 100);
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Darker asphalt
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        this.scene.add(road);
        this.floor = road;

        // Road Markings (Dashed Line)
        const lineGeometry = new THREE.PlaneGeometry(0.2, 2);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < 20; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.01, -45 + i * 5);
            this.scene.add(line);
        }

        // --- Sidewalks ---
        const sidewalkGeometry = new THREE.PlaneGeometry(3, 100);
        const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });

        const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        leftSidewalk.rotation.x = -Math.PI / 2;
        leftSidewalk.position.set(-6.5, 0.02, 0); // Slightly raised
        leftSidewalk.receiveShadow = true;
        this.scene.add(leftSidewalk);

        const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        rightSidewalk.rotation.x = -Math.PI / 2;
        rightSidewalk.position.set(6.5, 0.02, 0);
        rightSidewalk.receiveShadow = true;
        this.scene.add(rightSidewalk);

        // --- Buildings ---
        const buildingColors = [0xaaaaaa, 0xccbbaa, 0x8899aa, 0xdddddd, 0x998877];

        for (let i = 0; i < 6; i++) {
            // Left Buildings
            this.createBuilding(-12, -25 + i * 12, buildingColors[i % buildingColors.length]);
            // Right Buildings
            this.createBuilding(12, -25 + i * 12, buildingColors[(i + 2) % buildingColors.length]);
        }

        // --- Street Lamps ---
        for (let i = 0; i < 5; i++) {
            this.createStreetLamp(-4.5, -20 + i * 20);
            this.createStreetLamp(4.5, -10 + i * 20);
        }

        // --- Trees ---
        for (let i = 0; i < 6; i++) {
            this.createTree(-7, -15 + i * 15);
            this.createTree(7, -22 + i * 15);
        }

        // --- Car ---
        const car = new CarModel();
        car.mesh.position.set(2, 0, 2);
        car.mesh.rotation.y = Math.PI / 6;
        this.scene.add(car.mesh);
    }

    createBuilding(x, z, color) {
        const height = 10 + Math.random() * 10;
        const geometry = new THREE.BoxGeometry(8, height, 8);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        this.scene.add(building);

        // Windows (Simple black planes)
        const windowGeo = new THREE.PlaneGeometry(1, 1.5);
        const windowMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });

        const floors = Math.floor(height / 3);
        const side = x < 0 ? 1 : -1; // Face towards street

        for (let f = 1; f < floors; f++) {
            for (let w = -1; w <= 1; w++) {
                const win = new THREE.Mesh(windowGeo, windowMat);
                // Position relative to building center
                win.position.set(x + (side * 4.01), f * 3, z + (w * 2.5));
                win.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
                this.scene.add(win);
            }
        }
    }

    createStreetLamp(x, z) {
        const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, 2.5, z);
        this.scene.add(pole);

        const armGeo = new THREE.BoxGeometry(1.5, 0.1, 0.1);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.position.set(x + (x > 0 ? -0.75 : 0.75), 5, z);
        this.scene.add(arm);

        const bulbGeo = new THREE.SphereGeometry(0.2);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x + (x > 0 ? -1.4 : 1.4), 4.8, z);
        this.scene.add(bulb);

        // Point Light
        const light = new THREE.PointLight(0xffffaa, 1, 10);
        light.position.set(x + (x > 0 ? -1.4 : 1.4), 4.5, z);
        this.scene.add(light);
    }

    createTree(x, z) {
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 0.75, z);
        trunk.castShadow = true;
        this.scene.add(trunk);

        const leavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(x, 2.25, z);
        leaves.castShadow = true;
        this.scene.add(leaves);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Dimmer ambient
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(20, 30, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    update(delta) {
        // Animation updates if needed
    }
}
