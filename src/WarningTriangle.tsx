import { useStore } from './store';
import { useState, useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { Group } from 'three';

// Warning triangle prop - a reflective emergency triangle
export function WarningTriangleModel({ hovered }: { hovered?: boolean }) {
    const sideLength = 0.6;
    const barWidth = 0.08;
    const barThickness = 0.03;
    const height = (sideLength * Math.sqrt(3)) / 2;

    return (
        <group>
            {/* Triangle Frame constructed from 3 bars */}
            <group position={[0, height / 2, 0]}>

                {/* Bottom Bar */}
                <mesh position={[0, -height / 2 + barWidth / 2, 0]}>
                    <boxGeometry args={[sideLength, barWidth, barThickness]} />
                    <meshStandardMaterial
                        color="#ff3300"
                        emissive={hovered ? "#ff5500" : "#ff0000"}
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.1}
                    />
                </mesh>

                {/* Left Diagonal Bar */}
                <mesh
                    position={[-sideLength / 4, 0, 0]}
                    rotation={[0, 0, Math.PI / 3]}
                >
                    <boxGeometry args={[sideLength, barWidth, barThickness]} />
                    <meshStandardMaterial
                        color="#ff3300"
                        emissive={hovered ? "#ff5500" : "#ff0000"}
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.1}
                    />
                </mesh>

                {/* Right Diagonal Bar */}
                <mesh
                    position={[sideLength / 4, 0, 0]}
                    rotation={[0, 0, -Math.PI / 3]}
                >
                    <boxGeometry args={[sideLength, barWidth, barThickness]} />
                    <meshStandardMaterial
                        color="#ff3300"
                        emissive={hovered ? "#ff5500" : "#ff0000"}
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.1}
                    />
                </mesh>

                {/* Inner Reflective Strips (Slightly smaller, on top) */}
                <group position={[0, 0, 0.016]}>
                    {/* Bottom Strip */}
                    <mesh position={[0, -height / 2 + barWidth / 2, 0]}>
                        <boxGeometry args={[sideLength * 0.85, barWidth * 0.6, 0.005]} />
                        <meshStandardMaterial
                            color="#ffaa00"
                            emissive="#ffaa00"
                            emissiveIntensity={1} // Highly reflective
                            roughness={0.1}
                            metalness={0.0}
                        />
                    </mesh>

                    {/* Left Strip */}
                    <mesh
                        position={[-sideLength / 4 + 0.02, 0.02, 0]}
                        rotation={[0, 0, Math.PI / 3]}
                    >
                        <boxGeometry args={[sideLength * 0.85, barWidth * 0.6, 0.005]} />
                        <meshStandardMaterial
                            color="#ffaa00"
                            emissive="#ffaa00"
                            emissiveIntensity={1}
                            roughness={0.1}
                            metalness={0.0}
                        />
                    </mesh>

                    {/* Right Strip */}
                    <mesh
                        position={[sideLength / 4 - 0.02, 0.02, 0]}
                        rotation={[0, 0, -Math.PI / 3]}
                    >
                        <boxGeometry args={[sideLength * 0.85, barWidth * 0.6, 0.005]} />
                        <meshStandardMaterial
                            color="#ffaa00"
                            emissive="#ffaa00"
                            emissiveIntensity={1}
                            roughness={0.1}
                            metalness={0.0}
                        />
                    </mesh>
                </group>
            </group>

            {/* Metal Stand (Cross legs) */}
            <group position={[0, 0.02, 0]}>
                {/* Horizontal leg */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.5, 0.04, 0.04]} />
                    <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Perpendicular leg */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.04, 0.04, 0.5]} />
                    <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Vertical stem connector */}
                <mesh position={[0, 0.1, 0]}>
                    <boxGeometry args={[0.03, 0.2, 0.03]} />
                    <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
                </mesh>
            </group>
        </group>
    );
}

// Triangle in trunk - can be picked up
export function WarningTriangle(props: ThreeElements['group']) {
    const pickUpTriangle = useStore((state) => state.pickUpTriangle);
    const hasWarningTriangle = useStore((state) => state.hasWarningTriangle);
    const isTrianglePlaced = useStore((state) => state.isTrianglePlaced);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<Group>(null);

    // Use an inner ref for animation so we don't override the prop position
    const innerRef = useRef<Group>(null);

    useFrame((state) => {
        if (innerRef.current && !hasWarningTriangle && !isTrianglePlaced) {
            // Gentle floating animation (local to the component)
            innerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
        }
    });

    // Don't render if picked up or placed
    if (hasWarningTriangle || isTrianglePlaced) {
        return null;
    }

    return (
        <group
            {...props}
            ref={groupRef}
            onClick={() => {
                // Delay pickup slightly to prevent immediate placement by the global click handler
                setTimeout(pickUpTriangle, 100);
            }}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('warningtriangle');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            <group ref={innerRef}>
                <WarningTriangleModel hovered={hovered} />

                {/* Hover ring */}
                {hovered && (
                    <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0.15, 0.2, 32]} />
                        <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
                    </mesh>
                )}
            </group>
        </group>
    );
}

// Placed triangle in the world - can be picked up again
export function PlacedWarningTriangle() {
    const isTrianglePlaced = useStore((state) => state.isTrianglePlaced);
    const trianglePosition = useStore((state) => state.trianglePosition);
    const pickUpTriangle = useStore((state) => state.pickUpTriangle);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Slow rotation when placed
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    if (!isTrianglePlaced || !trianglePosition) {
        return null;
    }

    return (
        <group
            ref={groupRef}
            position={[trianglePosition.x, 0.2, trianglePosition.z]}
            onClick={(e) => {
                e.stopPropagation();
                setTimeout(pickUpTriangle, 100);
            }}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('warningtriangle');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            <WarningTriangleModel hovered={hovered} />
            {/* Glow effect */}
            <pointLight position={[0, 0.3, 0]} color="#ff4400" intensity={hovered ? 1 : 0.5} distance={3} />

            {/* Hover ring */}
            {hovered && (
                <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.2, 0.25, 32]} />
                    <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
                </mesh>
            )}
        </group>
    );
}
