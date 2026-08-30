import { useStore } from './store';
import { Box, RoundedBox } from '@react-three/drei';
import { useState, useRef } from 'react';
import { Group, MathUtils, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';
import { Bandage } from './Bandage';

// First Aid Kit that can be picked up from trunk
export function FirstAidKit(props: any) {
    const pickUpFirstAidKit = useStore((state) => state.pickUpFirstAidKit);
    const hasFirstAidKit = useStore((state) => state.hasFirstAidKit);
    const isFirstAidKitPlaced = useStore((state) => state.isFirstAidKitPlaced);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<Group>(null);

    // Don't render if kit is picked up or placed elsewhere
    if (hasFirstAidKit || isFirstAidKitPlaced) {
        return null;
    }

    return (
        <group
            {...props}
            ref={groupRef}
            onClick={pickUpFirstAidKit}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('firstaidkit');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            <FirstAidKitModel hovered={hovered} isOpen={false} />
        </group>
    );
}

// Placed First Aid Kit on the ground - can be opened
export function PlacedFirstAidKit() {
    const isFirstAidKitPlaced = useStore((state) => state.isFirstAidKitPlaced);
    const firstAidKitPosition = useStore((state) => state.firstAidKitPosition);
    const isFirstAidKitOpen = useStore((state) => state.isFirstAidKitOpen);
    const openFirstAidKit = useStore((state) => state.openFirstAidKit);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const hasBandage = useStore((state) => state.hasBandage);
    const armBandaged = useStore((state) => state.armBandaged);
    const [hovered, setHovered] = useState(false);

    if (!isFirstAidKitPlaced || !firstAidKitPosition) {
        return null;
    }

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (!isFirstAidKitOpen) {
            openFirstAidKit();
        }
    };

    return (
        <group
            position={[firstAidKitPosition.x, 0.125, firstAidKitPosition.z]}
            onPointerDown={handleClick}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('firstaidkit');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            <FirstAidKitModel
                hovered={hovered}
                isOpen={isFirstAidKitOpen}
            />

            {/* Bandage inside the kit - only visible when open and not taken */}
            {isFirstAidKitOpen && !hasBandage && !armBandaged && (
                <Bandage position={[0, 0.06, 0]} />
            )}
        </group>
    );
}

// Visual model for the first aid kit
export function FirstAidKitModel({
    hovered,
    isOpen,
}: {
    hovered: boolean;
    isOpen: boolean;
}) {
    const lidRef = useRef<Group>(null);

    useFrame(() => {
        if (lidRef.current) {
            const targetRotation = isOpen ? -Math.PI * 0.7 : 0;
            lidRef.current.rotation.x = MathUtils.lerp(lidRef.current.rotation.x, targetRotation, 0.2);
        }
    });

    // Plastic material settings
    const caseMaterial = (
        <meshStandardMaterial
            color={hovered ? "#ffebeb" : "#ffffff"}
            roughness={0.3}
            metalness={0.1}
        />
    );

    return (
        <group>
            {/* Invisible Hit Box for easier grabbing/opening - Only when closed */}
            {!isOpen && (
                <mesh visible={true}>
                    <boxGeometry args={[0.5, 0.3, 0.35]} />
                    <meshBasicMaterial side={DoubleSide} transparent opacity={0} depthWrite={false} />
                </mesh>
            )}

            {/* Bottom Case Body */}
            <group position={[0, -0.05, 0]}>
                <RoundedBox args={[0.35, 0.12, 0.20]} radius={0.02} smoothness={1}>
                    {caseMaterial}
                </RoundedBox>

                {/* Black rubber seal rim */}
                <mesh position={[0, 0.06, 0]}>
                    <boxGeometry args={[0.352, 0.01, 0.202]} />
                    <meshStandardMaterial color="#222222" roughness={0.9} />
                </mesh>
            </group>

            {/* Lid Group - Hinge Pivot Point is crucial */}
            <group ref={lidRef} position={[0, 0.015, -0.1]}>
                {/* Lid Body (Offset to match pivot) */}
                <group position={[0, 0.04, 0.1]}>
                    <RoundedBox args={[0.35, 0.08, 0.20]} radius={0.02} smoothness={1}>
                        {caseMaterial}
                    </RoundedBox>

                    {/* Red Cross Circle Emblem */}
                    <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.06, 32]} />
                        <meshStandardMaterial color="#cc0000" roughness={0.5} />
                    </mesh>

                    {/* White Cross on top */}
                    <group position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <mesh>
                            <planeGeometry args={[0.08, 0.025]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <planeGeometry args={[0.08, 0.025]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                    </group>
                </group>

                {/* Handle (Attached to lid front) */}
                {!isOpen && (
                    <group position={[0, 0.04, 0.2]}>
                        {/* Handle Grip */}
                        <RoundedBox args={[0.15, 0.02, 0.04]} radius={0.005} smoothness={1} position={[0, 0, 0.03]}>
                            <meshStandardMaterial color="#dddddd" roughness={0.5} />
                        </RoundedBox>
                        {/* Handle Connectors */}
                        <mesh position={[-0.06, 0, 0]}>
                            <boxGeometry args={[0.02, 0.02, 0.04]} />
                            <meshStandardMaterial color="#aaaaaa" metalness={0.5} />
                        </mesh>
                        <mesh position={[0.06, 0, 0]}>
                            <boxGeometry args={[0.02, 0.02, 0.04]} />
                            <meshStandardMaterial color="#aaaaaa" metalness={0.5} />
                        </mesh>
                    </group>
                )}
            </group>

            {/* Back Hinges */}
            <group position={[0, 0.015, -0.1]}>
                <mesh position={[-0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.04, 16]} />
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>
                <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.04, 16]} />
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>
            </group>

            {/* Front Latches (Bottom part) */}
            <group position={[0, -0.01, 0.1]}>
                <mesh position={[-0.1, 0, 0]}>
                    <boxGeometry args={[0.04, 0.04, 0.02]} />
                    <meshStandardMaterial color="#666666" metalness={0.9} />
                </mesh>
                <mesh position={[0.1, 0, 0]}>
                    <boxGeometry args={[0.04, 0.04, 0.02]} />
                    <meshStandardMaterial color="#666666" metalness={0.9} />
                </mesh>
            </group>

            {/* Interior (Only visible when open) */}
            {isOpen && (
                <group position={[0, -0.05, 0]}>
                    <Box args={[0.33, 0.08, 0.18]} position={[0, 0.02, 0]}>
                        <meshStandardMaterial color="#dddddd" />
                    </Box>
                    <mesh position={[0, 0.02, 0]}>
                        <boxGeometry args={[0.01, 0.06, 0.18]} />
                        <meshStandardMaterial color="#cccccc" />
                    </mesh>
                </group>
            )}
        </group>
    );
}
