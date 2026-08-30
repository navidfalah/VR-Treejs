import { useStore } from './store';
import { RoundedBox, Cylinder, Box } from '@react-three/drei';
import { FirstAidKit } from './FirstAidKit';
import { WarningTriangle } from './WarningTriangle';
import { useRef } from 'react';
import { Group } from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized wheel component
function Wheel({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire */}
            <Cylinder args={[0.38, 0.38, 0.28, 16]}>
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.9}
                />
            </Cylinder>

            {/* Rim */}
            <Cylinder args={[0.3, 0.3, 0.24, 16]}>
                <meshStandardMaterial
                    color="#a8a8a8"
                    metalness={0.85}
                    roughness={0.15}
                />
            </Cylinder>

            {/* Hub center */}
            <Cylinder args={[0.08, 0.08, 0.26]}>
                <meshStandardMaterial color="#404040" metalness={0.6} />
            </Cylinder>
        </group>
    );
}

export function HighFidelityCar(props: ThreeElements['group']) {
    const isTrunkOpen = useStore((state) => state.isTrunkOpen);
    const openTrunk = useStore((state) => state.openTrunk);
    const trunkRef = useRef<Group>(null);

    useFrame((_state, delta) => {
        if (trunkRef.current) {
            const targetRotation = isTrunkOpen ? Math.PI / 2 : 0; // 90 degrees
            trunkRef.current.rotation.x = THREE.MathUtils.lerp(trunkRef.current.rotation.x, targetRotation, delta * 5);
        }
    });

    const carColor = "#1e4c7c"; // Deeper, more natural blue
    const windowColor = "#a4c2d6";

    return (
        <group {...props}>
            {/* Main Body */}
            <RoundedBox args={[2.1, 0.75, 3.0]} radius={0.08} smoothness={4} position={[0, 0.8, 0.7]} castShadow>
                <meshStandardMaterial
                    color={carColor}
                    metalness={0.5}
                    roughness={0.4}
                />
            </RoundedBox>

            {/* Hood - slightly dented */}
            <Box args={[2.0, 0.25, 0.8]} position={[0, 0.9, 2.05]} rotation={[0.15, 0, 0]} castShadow>
                <meshStandardMaterial color="#4a6b8a" roughness={0.65} metalness={0.4} />
            </Box>

            {/* Trunk structure */}
            <RoundedBox args={[2.1, 0.1, 1.4]} radius={0.02} smoothness={4} position={[0, 0.45, -1.5]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </RoundedBox>
            <RoundedBox args={[0.18, 0.75, 1.4]} radius={0.04} smoothness={4} position={[0.95, 0.8, -1.5]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </RoundedBox>
            <RoundedBox args={[0.18, 0.75, 1.4]} radius={0.04} smoothness={4} position={[-0.95, 0.8, -1.5]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </RoundedBox>
            <RoundedBox args={[2.1, 0.75, 0.18]} radius={0.04} smoothness={4} position={[0, 0.8, -2.15]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </RoundedBox>

            {/* Cabin & Windows */}
            <RoundedBox args={[1.75, 0.65, 1.9]} radius={0.08} smoothness={4} position={[0, 1.48, 0.5]} castShadow>
                <meshStandardMaterial
                    color={windowColor}
                    metalness={0.92}
                    roughness={0.08}
                    transparent
                    opacity={0.55}
                />
            </RoundedBox>

            {/* Roof */}
            <RoundedBox args={[1.8, 0.08, 2.0]} radius={0.04} smoothness={4} position={[0, 1.82, 0.5]} castShadow>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </RoundedBox>

            {/* Windshield */}
            <Box args={[1.65, 0.6, 0.04]} rotation={[-0.18, 0, 0]} position={[0, 1.48, 1.42]}>
                <meshStandardMaterial
                    color="#c8dce8"
                    transparent
                    opacity={0.5}
                    roughness={0.08}
                    metalness={0.92}
                />
            </Box>

            {/* Wheels */}
            <group position={[0, 0.4, 0]}>
                <Wheel position={[1.05, 0, 1.45]} />
                <Wheel position={[-1.05, 0, 1.45]} />
                <Wheel position={[1.05, 0, -1.45]} />
                <Wheel position={[-1.05, 0, -1.45]} />
            </group>

            {/* Headlights */}
            <Box args={[0.28, 0.18, 0.08]} position={[0.58, 0.88, 2.2]}>
                <meshStandardMaterial
                    color="#fffacd"
                    emissive="#fff9c4"
                    emissiveIntensity={1.8}
                />
            </Box>
            <pointLight position={[0.58, 0.88, 2.35]} intensity={0.8} distance={12} color="#fff9c4" />

            <Box args={[0.28, 0.18, 0.08]} position={[-0.58, 0.88, 2.2]}>
                <meshStandardMaterial color="#6a6a6a" roughness={0.85} />
            </Box>

            {/* Tail lights */}
            <Box args={[0.28, 0.18, 0.09]} position={[0.58, 0.88, -2.2]}>
                <meshStandardMaterial color="#d32f2f" emissive="#c62828" emissiveIntensity={0.6} />
            </Box>
            <Box args={[0.28, 0.18, 0.09]} position={[-0.58, 0.88, -2.2]}>
                <meshStandardMaterial color="#d32f2f" emissive="#c62828" emissiveIntensity={0.6} />
            </Box>

            {/* Side mirrors */}
            <Box args={[0.12, 0.1, 0.06]} position={[0.95, 1.48, 1.15]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </Box>
            <Box args={[0.12, 0.1, 0.06]} position={[-0.95, 1.48, 1.15]}>
                <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
            </Box>

            {/* License plates */}
            <Box args={[0.45, 0.12, 0.02]} position={[0, 0.55, 2.22]}>
                <meshStandardMaterial color="#f5f5f5" />
            </Box>
            <Box args={[0.45, 0.12, 0.02]} position={[0, 0.55, -2.22]}>
                <meshStandardMaterial color="#f5f5f5" />
            </Box>

            {/* Trunk lid */}
            <group position={[0, 1.18, -0.8]} ref={trunkRef}>
                <group onClick={openTrunk}>
                    <RoundedBox args={[1.75, 0.08, 1.25]} radius={0.04} smoothness={4} position={[0, 0, -0.62]}>
                        <meshStandardMaterial color={carColor} metalness={0.6} roughness={0.35} />
                    </RoundedBox>
                </group>
            </group>

            {/* Trunk interior */}
            <Box args={[1.55, 0.04, 1.2]} position={[0, 0.5, -1.5]}>
                <meshStandardMaterial color="#2a2a2a" />
            </Box>

            {/* First Aid Kit */}
            {!useStore((state) => state.hasFirstAidKit) && (
                <FirstAidKit position={[0.3, 0.6, -1.5]} scale={0.75} />
            )}

            {/* Warning Triangle - visibility handled internally */}
            <WarningTriangle position={[-0.3, 0.6, -1.5]} scale={0.75} />
        </group>
    );
}
