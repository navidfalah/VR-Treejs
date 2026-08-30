import { useXRInputSourceState } from '@react-three/xr';
import { useStore } from './store';
import { Cylinder } from '@react-three/drei';
import { useRef } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { FirstAidKitModel } from './FirstAidKit';
import { WarningTriangleModel } from './WarningTriangle';

// Bandage roll model for held state
function HeldBandage() {
    return (
        <group scale={0.8}>
            {/* Bandage roll - white cylinder */}
            <Cylinder args={[0.04, 0.04, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial
                    color="#f5f5f5"
                    roughness={0.8}
                />
            </Cylinder>

            {/* Red cross on bandage */}
            <mesh position={[0, 0.041, 0]}>
                <boxGeometry args={[0.025, 0.002, 0.06]} />
                <meshStandardMaterial color="#cc0000" />
            </mesh>
            <mesh position={[0, 0.041, 0]}>
                <boxGeometry args={[0.06, 0.002, 0.025]} />
                <meshStandardMaterial color="#cc0000" />
            </mesh>
        </group>
    );
}

// Component that renders items attached to the right VR controller or hand
export function VRHeldItems() {
    const hasFirstAidKit = useStore((state) => state.hasFirstAidKit);
    const hasWarningTriangle = useStore((state) => state.hasWarningTriangle);
    const isTrianglePlaced = useStore((state) => state.isTrianglePlaced);
    const isFirstAidKitPlaced = useStore((state) => state.isFirstAidKitPlaced);
    const hasBandage = useStore((state) => state.hasBandage);
    const armBandaged = useStore((state) => state.armBandaged);

    const groupRef = useRef<Group>(null);

    // Get right controller state
    const rightController = useXRInputSourceState('controller', 'right');
    // Get right hand state for hand tracking
    const rightHand = useXRInputSourceState('hand', 'right');

    // Use hand if available, otherwise controller
    const inputSource = rightHand || rightController;

    useFrame(() => {
        if (groupRef.current && inputSource?.object) {
            // Copy the input source's world transform to the held item group
            inputSource.object.matrixWorld.decompose(
                groupRef.current.position,
                groupRef.current.quaternion,
                new Vector3()
            );

            // Offset the held item - different for hand vs controller
            const isHand = !!rightHand;
            const offset = isHand
                ? new Vector3(0, 0, -0.1)  // Hand: in front of palm
                : new Vector3(0, -0.05, -0.15);  // Controller: forward and down
            offset.applyQuaternion(groupRef.current.quaternion);
            groupRef.current.position.add(offset);
        }
    });

    // Determine what to show
    const showFirstAidKit = hasFirstAidKit && !isFirstAidKitPlaced;
    const showWarningTriangle = hasWarningTriangle && !isTrianglePlaced;
    const showBandage = hasBandage && !armBandaged;

    // Don't render if nothing to hold or no input source
    if (!inputSource || (!showFirstAidKit && !showWarningTriangle && !showBandage)) {
        return null;
    }

    return (
        <group ref={groupRef}>
            {showWarningTriangle && (
                <group scale={0.5} rotation={[-0.3, Math.PI, 0]} position={[0, 0, 0]}>
                    <WarningTriangleModel hovered={false} />
                </group>
            )}
            {showFirstAidKit && !showWarningTriangle && (
                <group scale={0.6}>
                    <FirstAidKitModel hovered={false} isOpen={false} />
                </group>
            )}
            {showBandage && !showFirstAidKit && !showWarningTriangle && (
                <group position={[0, 0, 0.08]}>
                    <HeldBandage />
                </group>
            )}
        </group>
    );
}
