import { useXR, XROrigin, useXRControllerLocomotion } from '@react-three/xr';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useStore } from './store';
import { useRef, useEffect } from 'react';
import { Group } from 'three';

export function VRHandControllers() {
    const { session } = useXR();
    const { camera } = useThree();
    const setPlayerPosition = useStore((state) => state.setPlayerPosition);
    const setNearCar = useStore((state) => state.setNearCar);
    const originRef = useRef<Group>(null);

    // Left stick for movement, right stick for rotation
    useXRControllerLocomotion(
        originRef,
        { speed: 2 }, // Translation options
        { type: 'smooth', speed: 2 }, // Rotation options - smooth turning
        'left' // Left controller for movement
    );

    // Update game state based on player position
    useEffect(() => {
        if (!session) return;

        const interval = setInterval(() => {
            if (originRef.current) {
                // Calculate world position
                const worldPos = new Vector3();
                worldPos.copy(camera.position);
                worldPos.add(originRef.current.position);
                setPlayerPosition(worldPos);

                // Check car proximity for interactions
                const carPos = new Vector3(-5.8, 0, 0);
                const distToCar = worldPos.distanceTo(carPos);
                setNearCar(distToCar < 4);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [session, camera, setPlayerPosition, setNearCar]);

    // Only render XROrigin when in VR session
    if (!session) return null;

    return (
        <XROrigin ref={originRef} position={[0, 0, 8]}>
            {/* XROrigin contains the camera and controllers */}
            {/* Held items are rendered via VRHeldItems component */}
        </XROrigin>
    );
}


