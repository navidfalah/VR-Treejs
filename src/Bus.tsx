import { RoundedBox, Cylinder, Box } from '@react-three/drei';

// Wheel component for the bus
function BusWheel({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire */}
            <Cylinder args={[0.5, 0.5, 0.35, 24]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Cylinder>
            {/* Rim */}
            <Cylinder args={[0.35, 0.35, 0.3, 16]}>
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Hub */}
            <Cylinder args={[0.12, 0.12, 0.36, 8]}>
                <meshStandardMaterial color="#555555" metalness={0.6} />
            </Cylinder>
        </group>
    );
}

// Window component
function BusWindow({ position, width = 0.8, height = 0.9 }: { position: [number, number, number]; width?: number; height?: number }) {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.05, height, width]} />
            <meshStandardMaterial
                color="#88bbdd"
                transparent
                opacity={0.6}
                metalness={0.9}
                roughness={0.1}
            />
        </mesh>
    );
}

interface BusProps {
    position: [number, number, number];
    rotation?: number;
    color?: string;
}

export function Bus({ position, rotation = 0, color = "#e8c940" }: BusProps) {
    // Bus dimensions: ~10m long, ~2.5m wide, ~3m tall
    const busLength = 8;
    const busWidth = 2.4;
    const busHeight = 2.8;

    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Main body */}
            <RoundedBox
                args={[busWidth, busHeight - 0.8, busLength]}
                radius={0.15}
                smoothness={4}
                position={[0, 1.8, 0]}
                castShadow
            >
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
            </RoundedBox>

            {/* Lower body panel*/}
            <Box args={[busWidth + 0.03, 0.6, busLength + 0.03]} position={[0, 0.8, 0]} castShadow>
                <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
            </Box>

            {/* Roof */}
            <RoundedBox
                args={[busWidth - 0.2, 0.15, busLength - 0.4]}
                radius={0.05}
                smoothness={2}
                position={[0, 2.95, 0]}
                castShadow
            >
                <meshStandardMaterial color="#dddddd" roughness={0.6} />
            </RoundedBox>

            {/* Windows - Left side */}
            {[-2.8, -1.8, -0.8, 1.2].map((z, i) => (
                <BusWindow key={`left-${i}`} position={[-1.22, 2.0, z]} />
            ))}

            {/* Windows - Right side */}
            {[-2.8, -1.8, -0.8, 0.2, 1.2, 2.2].map((z, i) => (
                <BusWindow key={`right-${i}`} position={[1.22, 2.0, z]} />
            ))}

            {/* Front windshield */}
            <mesh position={[0, 2.0, 4.02]} rotation={[0.08, 0, 0]}>
                <boxGeometry args={[2.0, 1.4, 0.05]} />
                <meshStandardMaterial
                    color="#99ccee"
                    transparent
                    opacity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Rear windshield */}
            <mesh position={[0, 2.0, -4.02]}>
                <boxGeometry args={[1.8, 1.2, 0.05]} />
                <meshStandardMaterial
                    color="#99ccee"
                    transparent
                    opacity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Front headlights */}
            <Box args={[0.35, 0.2, 0.08]} position={[0.8, 1.2, 4.02]}>
                <meshStandardMaterial color="#ffffcc" emissive="#fff9c4" emissiveIntensity={0.5} />
            </Box>
            <Box args={[0.35, 0.2, 0.08]} position={[-0.8, 1.2, 4.02]}>
                <meshStandardMaterial color="#ffffcc" emissive="#fff9c4" emissiveIntensity={0.5} />
            </Box>

            {/* Rear tail lights */}
            <Box args={[0.3, 0.25, 0.08]} position={[0.9, 1.4, -4.02]}>
                <meshStandardMaterial color="#cc2222" emissive="#cc2222" emissiveIntensity={0.4} />
            </Box>
            <Box args={[0.3, 0.25, 0.08]} position={[-0.9, 1.4, -4.02]}>
                <meshStandardMaterial color="#cc2222" emissive="#cc2222" emissiveIntensity={0.4} />
            </Box>

            {/* Turn signals (orange) */}
            <Box args={[0.15, 0.15, 0.08]} position={[1.05, 1.4, 4.02]}>
                <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.3} />
            </Box>
            <Box args={[0.15, 0.15, 0.08]} position={[-1.05, 1.4, 4.02]}>
                <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.3} />
            </Box>

            {/* Front door (folding doors) - on left side */}
            <group position={[-1.21, 1.4, 2.8]}>
                {/* Door frame */}
                <Box args={[0.05, 1.8, 1.0]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" />
                </Box>
                {/* Door glass */}
                <Box args={[0.03, 1.4, 0.8]} position={[-0.02, 0.1, 0]}>
                    <meshStandardMaterial
                        color="#aaddee"
                        transparent
                        opacity={0.5}
                        metalness={0.8}
                        roughness={0.1}
                    />
                </Box>
            </group>

            {/* Middle door - on left side */}
            <group position={[-1.21, 1.4, 0]}>
                <Box args={[0.05, 1.8, 1.2]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" />
                </Box>
                <Box args={[0.03, 1.4, 1.0]} position={[-0.02, 0.1, 0]}>
                    <meshStandardMaterial
                        color="#aaddee"
                        transparent
                        opacity={0.5}
                        metalness={0.8}
                        roughness={0.1}
                    />
                </Box>
            </group>

            {/* Side mirrors */}
            <Box args={[0.4, 0.25, 0.08]} position={[1.35, 2.2, 3.5]}>
                <meshStandardMaterial color="#222222" />
            </Box>
            <Box args={[0.4, 0.25, 0.08]} position={[-1.35, 2.2, 3.5]}>
                <meshStandardMaterial color="#222222" />
            </Box>

            {/* Wheel wells */}
            <Box args={[0.15, 0.7, 1.2]} position={[1.2, 0.8, 2.8]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Box args={[0.15, 0.7, 1.2]} position={[-1.2, 0.8, 2.8]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Box args={[0.15, 0.7, 1.2]} position={[1.2, 0.8, -2.5]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Box args={[0.15, 0.7, 1.2]} position={[-1.2, 0.8, -2.5]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>

            {/* Wheels */}
            <BusWheel position={[1.3, 0.5, 2.8]} />
            <BusWheel position={[-1.3, 0.5, 2.8]} />
            <BusWheel position={[1.3, 0.5, -2.5]} />
            <BusWheel position={[-1.3, 0.5, -2.5]} />

            {/* Destination sign (front) */}
            <Box args={[1.6, 0.35, 0.05]} position={[0, 2.7, 4.01]}>
                <meshStandardMaterial color="#111111" />
            </Box>
            {/* LED text simulation */}
            <Box args={[1.4, 0.25, 0.02]} position={[0, 2.7, 4.04]}>
                <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.8} />
            </Box>

            {/* Route number on side */}
            <Box args={[0.04, 0.5, 0.7]} position={[1.22, 2.6, 3.2]}>
                <meshStandardMaterial color="#ffffff" />
            </Box>

            {/* Bumpers */}
            <RoundedBox args={[busWidth + 0.1, 0.2, 0.25]} radius={0.05} position={[0, 0.55, 4.1]} castShadow>
                <meshStandardMaterial color="#333333" roughness={0.6} metalness={0.4} />
            </RoundedBox>
            <RoundedBox args={[busWidth + 0.1, 0.2, 0.25]} radius={0.05} position={[0, 0.55, -4.1]} castShadow>
                <meshStandardMaterial color="#333333" roughness={0.6} metalness={0.4} />
            </RoundedBox>
        </group>
    );
}
