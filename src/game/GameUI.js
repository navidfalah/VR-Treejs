import * as THREE from 'three';

export class GameUI {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.uiGroup = new THREE.Group();
        this.scene.add(this.uiGroup);

        // Position UI in front of camera by default (will need update in VR)
        this.uiGroup.position.set(0, 1.6, -2);
    }

    createMessage(text) {
        // Clear previous UI
        while (this.uiGroup.children.length > 0) {
            this.uiGroup.remove(this.uiGroup.children[0]);
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 512;

        // Background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        context.font = '48px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Wrap text
        const words = text.split(' ');
        let line = '';
        let y = canvas.height / 2 - 50;
        const lineHeight = 60;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > canvas.width - 100 && n > 0) {
                context.fillText(line, canvas.width / 2, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, canvas.width / 2, y);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 1, 1);

        this.uiGroup.add(sprite);
    }

    update() {
        // Optional: Billboard effect if not using Sprite (Sprites auto-billboard)
    }
}
