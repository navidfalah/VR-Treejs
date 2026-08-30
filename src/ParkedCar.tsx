import { RoundedBox, Cylinder, Box, Sphere } from '@react-three/drei';

// Wheel component for parked cars
function Wheel({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire */}
            <Cylinder args={[0.38, 0.38, 0.28, 16]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Cylinder>
            {/* Rim */}
            <Cylinder args={[0.3, 0.3, 0.24, 16]}>
                <meshStandardMaterial color="#a8a8a8" metalness={0.85} roughness={0.15} />
            </Cylinder>
            {/* Hub */}
            <Cylinder args={[0.08, 0.08, 0.26]}>
                <meshStandardMaterial color="#404040" metalness={0.6} />
            </Cylinder>
        </group>
    );
}

// Simplified seated driver visible through windshield
function Driver({ skinColor = "#e8c4a8", shirtColor = "#3a5a8a", hairColor = "#3a2a1a" }: { skinColor?: string; shirtColor?: string; hairColor?: string }) {
    return (
        <group position={[-0.35, 1.25, 0.3]}>
            {/* Head */}
            <Sphere args={[0.14, 12, 12]} position={[0, 0.35, 0]} castShadow>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Sphere>

            {/* Face features */}
            {/* Left eye */}
            <Sphere args={[0.025, 8, 8]} position={[-0.04, 0.38, 0.12]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.015, 6, 6]} position={[-0.04, 0.38, 0.135]}>
                <meshStandardMaterial color="#3a2a1a" />
            </Sphere>
            {/* Right eye */}
            <Sphere args={[0.025, 8, 8]} position={[0.04, 0.38, 0.12]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.015, 6, 6]} position={[0.04, 0.38, 0.135]}>
                <meshStandardMaterial color="#3a2a1a" />
            </Sphere>
            {/* Nose */}
            <Sphere args={[0.02, 6, 6]} position={[0, 0.34, 0.13]}>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Sphere>
            {/* Mouth */}
            <Box args={[0.04, 0.01, 0.01]} position={[0, 0.29, 0.12]}>
                <meshStandardMaterial color="#8a5a5a" />
            </Box>

            {/* Hair */}
            <Sphere args={[0.145, 12, 12]} position={[0, 0.4, -0.02]} scale={[1, 0.7, 0.9]}>
                <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Sphere>
            {/* Neck */}
            <Cylinder args={[0.05, 0.06, 0.08, 8]} position={[0, 0.18, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Cylinder>
            {/* Upper body/shoulders */}
            <Box args={[0.35, 0.2, 0.18]} position={[0, 0.08, 0]} castShadow>
                <meshStandardMaterial color={shirtColor} roughness={0.8} />
            </Box>
            {/* Left arm reaching to steering wheel */}
            <group position={[-0.12, 0.02, 0.12]}>
                <Cylinder args={[0.04, 0.035, 0.2, 8]} rotation={[0.5, 0, 0.3]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.8} />
                </Cylinder>
                {/* Hand on wheel */}
                <Sphere args={[0.04, 8, 8]} position={[0.05, -0.05, 0.15]}>
                    <meshStandardMaterial color={skinColor} roughness={0.75} />
                </Sphere>
            </group>
            {/* Right arm reaching to steering wheel */}
            <group position={[0.12, 0.02, 0.12]}>
                <Cylinder args={[0.04, 0.035, 0.2, 8]} rotation={[0.5, 0, -0.3]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.8} />
                </Cylinder>
                {/* Hand on wheel */}
                <Sphere args={[0.04, 8, 8]} position={[-0.05, -0.05, 0.15]}>
                    <meshStandardMaterial color={skinColor} roughness={0.75} />
                </Sphere>
            </group>
        </group>
    );
}

// Passenger (optional, simpler than driver)
function Passenger({ skinColor = "#d9b89a", shirtColor = "#8a4a5a", hairColor = "#5a4030" }: { skinColor?: string; shirtColor?: string; hairColor?: string }) {
    return (
        <group position={[0.35, 1.25, 0.3]}>
            {/* Head */}
            <Sphere args={[0.13, 12, 12]} position={[0, 0.33, 0]} castShadow>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Sphere>

            {/* Face features */}
            {/* Left eye */}
            <Sphere args={[0.022, 8, 8]} position={[-0.035, 0.36, 0.11]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.012, 6, 6]} position={[-0.035, 0.36, 0.125]}>
                <meshStandardMaterial color="#4a3a2a" />
            </Sphere>
            {/* Right eye */}
            <Sphere args={[0.022, 8, 8]} position={[0.035, 0.36, 0.11]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.012, 6, 6]} position={[0.035, 0.36, 0.125]}>
                <meshStandardMaterial color="#4a3a2a" />
            </Sphere>
            {/* Nose */}
            <Sphere args={[0.018, 6, 6]} position={[0, 0.32, 0.12]}>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Sphere>
            {/* Mouth */}
            <Box args={[0.035, 0.008, 0.008]} position={[0, 0.27, 0.11]}>
                <meshStandardMaterial color="#9a5a5a" />
            </Box>

            {/* Hair */}
            <Sphere args={[0.135, 12, 12]} position={[0, 0.38, -0.02]} scale={[1, 0.75, 0.9]}>
                <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Sphere>
            {/* Upper body */}
            <Box args={[0.3, 0.18, 0.16]} position={[0, 0.08, 0]} castShadow>
                <meshStandardMaterial color={shirtColor} roughness={0.8} />
            </Box>
        </group>
    );
}

interface ParkedCarProps {
    position: [number, number, number];
    rotation?: number;
    color?: string;
    hasPassenger?: boolean;
    driverShirtColor?: string;
}

export function ParkedCar({ position, rotation = 0, color = "#cc3333", hasPassenger = false, driverShirtColor = "#3a5a8a" }: ParkedCarProps) {
    const windowColor = "#a4c2d6";

    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Main Body */}
            <RoundedBox args={[2.1, 0.75, 3.0]} radius={0.08} smoothness={4} position={[0, 0.8, 0]} castShadow>
                <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
            </RoundedBox>

            {/* Hood */}
            <Box args={[2.0, 0.25, 0.8]} position={[0, 0.9, 1.35]} rotation={[0.1, 0, 0]} castShadow>
                <meshStandardMaterial color={color} roughness={0.45} metalness={0.5} />
            </Box>

            {/* Trunk */}
            <Box args={[2.0, 0.2, 0.6]} position={[0, 0.85, -1.3]} castShadow>
                <meshStandardMaterial color={color} roughness={0.45} metalness={0.5} />
            </Box>

            {/* Cabin & Windows */}
            <RoundedBox args={[1.75, 0.65, 1.9]} radius={0.08} smoothness={4} position={[0, 1.48, 0]} castShadow>
                <meshStandardMaterial
                    color={windowColor}
                    metalness={0.92}
                    roughness={0.08}
                    transparent
                    opacity={0.55}
                />
            </RoundedBox>

            {/* Roof */}
            <RoundedBox args={[1.8, 0.08, 2.0]} radius={0.04} smoothness={4} position={[0, 1.82, 0]} castShadow>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
            </RoundedBox>

            {/* Windshield */}
            <Box args={[1.65, 0.6, 0.04]} rotation={[-0.18, 0, 0]} position={[0, 1.48, 0.92]}>
                <meshStandardMaterial
                    color="#c8dce8"
                    transparent
                    opacity={0.5}
                    roughness={0.08}
                    metalness={0.92}
                />
            </Box>

            {/* Rear windshield */}
            <Box args={[1.5, 0.5, 0.04]} rotation={[0.15, 0, 0]} position={[0, 1.45, -0.92]}>
                <meshStandardMaterial
                    color="#c8dce8"
                    transparent
                    opacity={0.5}
                    roughness={0.08}
                    metalness={0.92}
                />
            </Box>

            {/* Driver inside the car */}
            <Driver shirtColor={driverShirtColor} />

            {/* Optional passenger */}
            {hasPassenger && <Passenger />}

            {/* Steering wheel hint (dark circle) */}
            <Cylinder args={[0.12, 0.12, 0.02, 16]} position={[-0.35, 1.15, 0.55]} rotation={[0.4, 0, 0]}>
                <meshStandardMaterial color="#222222" />
            </Cylinder>

            {/* Wheels */}
            <Wheel position={[1.05, 0.4, 0.95]} />
            <Wheel position={[-1.05, 0.4, 0.95]} />
            <Wheel position={[1.05, 0.4, -0.95]} />
            <Wheel position={[-1.05, 0.4, -0.95]} />

            {/* Headlights */}
            <Box args={[0.28, 0.18, 0.08]} position={[0.58, 0.88, 1.7]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={0.3} />
            </Box>
            <Box args={[0.28, 0.18, 0.08]} position={[-0.58, 0.88, 1.7]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={0.3} />
            </Box>

            {/* Tail lights */}
            <Box args={[0.28, 0.18, 0.08]} position={[0.58, 0.88, -1.7]}>
                <meshStandardMaterial color="#d32f2f" emissive="#c62828" emissiveIntensity={0.3} />
            </Box>
            <Box args={[0.28, 0.18, 0.08]} position={[-0.58, 0.88, -1.7]}>
                <meshStandardMaterial color="#d32f2f" emissive="#c62828" emissiveIntensity={0.3} />
            </Box>

            {/* Side mirrors */}
            <Box args={[0.12, 0.1, 0.06]} position={[0.95, 1.48, 0.65]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
            </Box>
            <Box args={[0.12, 0.1, 0.06]} position={[-0.95, 1.48, 0.65]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
            </Box>

            {/* License plates */}
            <Box args={[0.45, 0.12, 0.02]} position={[0, 0.55, 1.72]}>
                <meshStandardMaterial color="#f5f5f5" />
            </Box>
            <Box args={[0.45, 0.12, 0.02]} position={[0, 0.55, -1.72]}>
                <meshStandardMaterial color="#f5f5f5" />
            </Box>
        </group>
    );
}
