import { useFrame, useThree, createPortal } from '@react-three/fiber';
import { useState, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { useStore } from './store';
import { FirstAidKit } from './FirstAidKit';
import { useXR } from '@react-three/xr';

const MOVEMENT_SPEED = 5;
const MOUSE_SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.1;

const CAR_BOUNDS = {
    minX: -1.2, maxX: 1.2,
    minZ: -7.3, maxZ: -2.7,
    minY: 0, maxY: 2.0
};

export function PlayerController() {
    const { camera, gl } = useThree();
    const { session } = useXR(); // Get XR session to detect VR mode
    const isInVR = !!session; // True when in VR

    const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
    const hasFirstAidKit = useStore((state) => state.hasFirstAidKit);
    const hasWarningTriangle = useStore((state) => state.hasWarningTriangle);
    const placeTriangle = useStore((state) => state.placeTriangle);
    const setPlayerPosition = useStore((state) => state.setPlayerPosition);
    const callEMS = useStore((state) => state.callEMS);
    const currentObjective = useStore((state) => state.currentObjective);
    const emsCalled = useStore((state) => state.emsCalled);
    const setNearCar = useStore((state) => state.setNearCar);

    // Camera rotation state
    const yaw = useRef(0); // Left-right rotation
    const pitch = useRef(0); // Up-down rotation
    const isPointerLocked = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: true }));
        const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: false }));

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Pointer lock for mouse look
        const canvas = gl.domElement;

        const handleClick = () => {
            if (!isPointerLocked.current) {
                canvas.requestPointerLock();
            }
        };

        const handlePointerLockChange = () => {
            isPointerLocked.current = document.pointerLockElement === canvas;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isPointerLocked.current) return;

            // Update yaw (left-right) and pitch (up-down)
            yaw.current -= e.movementX * MOUSE_SENSITIVITY;
            pitch.current -= e.movementY * MOUSE_SENSITIVITY;

            // Clamp pitch to prevent flipping
            pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current));
        };

        canvas.addEventListener('click', handleClick);
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('click', handleClick);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gl]);

    useFrame((_state, delta) => {
        // Skip desktop controls when in VR - VRHandControllers handles movement
        if (isInVR) return;

        // Apply camera rotation from mouse look
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

        const moveDir = new Vector3();

        // Forward/Backward (W/S or ArrowUp/ArrowDown)
        if (keys['KeyW'] || keys['ArrowUp']) moveDir.z -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) moveDir.z += 1;

        // Left/Right (A/D or ArrowLeft/ArrowRight)
        if (keys['KeyA'] || keys['ArrowLeft']) moveDir.x -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) moveDir.x += 1;

        // Up/Down (Shift/Space)
        if (keys['Space']) moveDir.y += 1;
        if (keys['ShiftLeft'] || keys['ShiftRight']) moveDir.y -= 1;

        // Apply rotation to movement direction
        const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0; // Keep movement horizontal
        forward.normalize();

        const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();

        const finalMove = new Vector3();

        // Calculate movement based on camera direction
        if (keys['KeyW'] || keys['ArrowUp']) finalMove.add(forward);
        if (keys['KeyS'] || keys['ArrowDown']) finalMove.sub(forward);
        if (keys['KeyA'] || keys['ArrowLeft']) finalMove.sub(right);
        if (keys['KeyD'] || keys['ArrowRight']) finalMove.add(right);

        finalMove.normalize().multiplyScalar(MOVEMENT_SPEED * delta);

        // Add vertical movement
        if (keys['Space']) finalMove.y += MOVEMENT_SPEED * delta;
        if (keys['ShiftLeft'] || keys['ShiftRight']) finalMove.y -= MOVEMENT_SPEED * delta;

        // Collision Detection with Car
        const checkCollision = (pos: Vector3) => {
            return (
                pos.x > CAR_BOUNDS.minX && pos.x < CAR_BOUNDS.maxX &&
                pos.z > CAR_BOUNDS.minZ && pos.z < CAR_BOUNDS.maxZ &&
                pos.y > CAR_BOUNDS.minY && pos.y < CAR_BOUNDS.maxY
            );
        };

        let targetPos = camera.position.clone().add(finalMove);

        if (checkCollision(targetPos)) {
            // Collision detected, try sliding
            const currentPos = camera.position.clone();
            let proposedPos = currentPos.clone();

            // Try X movement
            proposedPos.x += finalMove.x;
            if (!checkCollision(proposedPos)) {
                camera.position.x += finalMove.x;
            } else {
                proposedPos.x -= finalMove.x;
            }

            // Try Z movement
            proposedPos.z += finalMove.z;
            if (!checkCollision(proposedPos)) {
                camera.position.z += finalMove.z;
            } else {
                proposedPos.z -= finalMove.z;
            }

            // Try Y movement
            proposedPos.y += finalMove.y;
            if (!checkCollision(proposedPos)) {
                camera.position.y += finalMove.y;
            }

        } else {
            // No collision, move freely
            camera.position.copy(targetPos);
        }

        // Call EMS (Level 2)
        if (keys['KeyC'] && currentObjective === 'call_ems' && !emsCalled) {
            callEMS();
        }

        // Place warning triangle (T key)
        if (keys['KeyT'] && hasWarningTriangle) {
            placeTriangle(camera.position.clone());
        }

        // Update player position in store
        setPlayerPosition(camera.position.clone());

        // Check car proximity
        const carPos = new Vector3(0, 0, -5);
        const distToCar = camera.position.distanceTo(carPos);
        setNearCar(distToCar < 4);
    });

    return (
        <>
            {/* Render First Aid Kit in hand if picked up */}
            {hasFirstAidKit && createPortal(
                <group position={[0.3, -0.3, -0.5]} rotation={[0, -0.2, 0]} scale={0.5}>
                    <FirstAidKit />
                </group>,
                camera
            )}
        </>
    );
}
