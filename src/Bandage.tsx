import { useStore } from './store';
import { Cylinder, Box } from '@react-three/drei';
import { useState } from 'react';

// Bandage component displayed inside open first aid kit
export function Bandage({ position = [0, 0, 0] as [number, number, number] }) {
    const pickUpBandage = useStore((state) => state.pickUpBandage);
    const hasBandage = useStore((state) => state.hasBandage);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const [hovered, setHovered] = useState(false);

    // Don't render if bandage is already picked up
    if (hasBandage) {
        return null;
    }

    return (
        <group
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                pickUpBandage();
            }}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('bandage');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            {/* Bandage roll - white cylinder */}
            <Cylinder args={[0.04, 0.04, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial
                    color={hovered ? "#ffffee" : "#f5f5f5"}
                    roughness={0.8}
                    emissive={hovered ? "#ffffff" : "#000000"}
                    emissiveIntensity={hovered ? 0.3 : 0}
                />
            </Cylinder>

            {/* Red cross on bandage */}
            <Box args={[0.025, 0.002, 0.06]} position={[0, 0.041, 0]}>
                <meshStandardMaterial color="#cc0000" />
            </Box>
            <Box args={[0.06, 0.002, 0.025]} position={[0, 0.041, 0]}>
                <meshStandardMaterial color="#cc0000" />
            </Box>
        </group>
    );
}

// Bandage wrap visual that appears on the arm
export function BandageWrap({ wrapIndex, armRadius = 0.065 }: { wrapIndex: number; armRadius?: number }) {
    const yOffset = wrapIndex * 0.025; // Stack wraps along the arm

    return (
        <Cylinder
            args={[armRadius + 0.005, armRadius + 0.005, 0.02, 16]}
            position={[0, yOffset - 0.05, 0]}
            rotation={[0, 0, 0]}
        >
            <meshStandardMaterial
                color="#f5f5f5"
                roughness={0.9}
            />
        </Cylinder>
    );
}
