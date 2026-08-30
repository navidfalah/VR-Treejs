import { Box, Cylinder } from '@react-three/drei';

// Scattered debris pieces
function DebrisPiece({
    position,
    size,
    rotation,
    color = '#888888'
}: {
    position: [number, number, number];
    size: [number, number, number];
    rotation?: [number, number, number];
    color?: string;
}) {
    return (
        <Box
            args={size}
            position={position}
            rotation={rotation || [0, 0, 0]}
            castShadow
        >
            <meshStandardMaterial color={color} roughness={0.9} />
        </Box>
    );
}

// Crack lines on the building wall
function WallCrack({
    position,
    rotation = [0, 0, 0],
    scale = 1
}: {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Main crack line */}
            <Box args={[0.03, 0.8, 0.01]} position={[0, 0, 0]} rotation={[0, 0, 0.2]}>
                <meshStandardMaterial color="#2a2a2a" />
            </Box>
            <Box args={[0.02, 0.5, 0.01]} position={[0.1, 0.3, 0]} rotation={[0, 0, -0.4]}>
                <meshStandardMaterial color="#2a2a2a" />
            </Box>
            <Box args={[0.02, 0.4, 0.01]} position={[-0.08, -0.2, 0]} rotation={[0, 0, 0.6]}>
                <meshStandardMaterial color="#2a2a2a" />
            </Box>
        </group>
    );
}

// Broken/damaged section of wall
function BrokenWallSection({
    position,
    rotation = [0, 0, 0]
}: {
    position: [number, number, number];
    rotation?: [number, number, number];
}) {
    const wallColor = '#8B4513'; // Match the brick red building color
    const darkColor = '#5a3010';

    return (
        <group position={position} rotation={rotation}>
            {/* Jagged broken edges - top edge */}
            <Box args={[0.3, 0.15, 0.4]} position={[-0.8, 1.2, 0]} rotation={[0.1, 0, 0.3]}>
                <meshStandardMaterial color={wallColor} roughness={0.95} />
            </Box>
            <Box args={[0.25, 0.12, 0.35]} position={[-0.4, 1.35, 0.05]} rotation={[-0.1, 0.1, -0.2]}>
                <meshStandardMaterial color={darkColor} roughness={0.95} />
            </Box>
            <Box args={[0.2, 0.18, 0.3]} position={[0.2, 1.25, -0.1]} rotation={[0.15, -0.1, 0.15]}>
                <meshStandardMaterial color={wallColor} roughness={0.95} />
            </Box>
            <Box args={[0.35, 0.1, 0.4]} position={[0.7, 1.3, 0.08]} rotation={[-0.08, 0.2, -0.25]}>
                <meshStandardMaterial color={darkColor} roughness={0.95} />
            </Box>

            {/* Side jagged edges - left */}
            <Box args={[0.15, 0.4, 0.3]} position={[-1.1, 0.6, 0]} rotation={[0.2, 0, -0.1]}>
                <meshStandardMaterial color={wallColor} roughness={0.95} />
            </Box>
            <Box args={[0.12, 0.3, 0.25]} position={[-1.05, 0.1, 0.1]} rotation={[-0.1, 0.15, 0.2]}>
                <meshStandardMaterial color={darkColor} roughness={0.95} />
            </Box>

            {/* Side jagged edges - right */}
            <Box args={[0.15, 0.35, 0.28]} position={[1.0, 0.5, 0.05]} rotation={[0.15, 0, 0.15]}>
                <meshStandardMaterial color={wallColor} roughness={0.95} />
            </Box>
            <Box args={[0.12, 0.25, 0.22]} position={[1.1, 0, -0.05]} rotation={[-0.12, -0.1, -0.2]}>
                <meshStandardMaterial color={darkColor} roughness={0.95} />
            </Box>

            {/* Bottom jagged edges */}
            <Box args={[0.28, 0.12, 0.35]} position={[-0.5, -0.1, 0.08]} rotation={[0.2, 0, 0.1]}>
                <meshStandardMaterial color={wallColor} roughness={0.95} />
            </Box>
            <Box args={[0.22, 0.1, 0.3]} position={[0.3, -0.05, -0.05]} rotation={[-0.15, 0.1, -0.15]}>
                <meshStandardMaterial color={darkColor} roughness={0.95} />
            </Box>

            {/* Exposed interior/structural elements - like exposed brick layers */}
            <Box args={[1.8, 0.08, 0.15]} position={[0, 0.8, -0.15]} rotation={[0, 0, 0.02]}>
                <meshStandardMaterial color="#4a4a4a" roughness={0.85} />
            </Box>
            <Box args={[1.5, 0.06, 0.12]} position={[0.1, 0.4, -0.18]} rotation={[0, 0, -0.01]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.85} />
            </Box>
        </group>
    );
}

// Main crash damage component
export function CrashDamage() {
    return (
        <group>
            {/* Broken wall section on the building */}
            <BrokenWallSection
                position={[-6, 0.8, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />

            {/* Cracks radiating from impact point on building wall */}
            <WallCrack position={[-6.1, 2.5, -0.8]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
            <WallCrack position={[-6.1, 2.8, 0.6]} rotation={[0, Math.PI / 2, Math.PI / 4]} scale={1.2} />
            <WallCrack position={[-6.1, 1.8, 1.2]} rotation={[0, Math.PI / 2, -Math.PI / 6]} scale={1.0} />
            <WallCrack position={[-6.1, 3.2, -0.3]} rotation={[0, Math.PI / 2, Math.PI / 8]} scale={0.8} />

            {/* Ground debris - scattered chunks of building material */}
            <DebrisPiece position={[-5.2, 0.1, 0.8]} size={[0.3, 0.2, 0.25]} rotation={[0.3, 0.5, 0.1]} color="#7a3a10" />
            <DebrisPiece position={[-5.5, 0.08, 1.2]} size={[0.2, 0.15, 0.18]} rotation={[0.1, 0.8, 0.2]} color="#8B4513" />
            <DebrisPiece position={[-4.8, 0.12, 0.5]} size={[0.25, 0.18, 0.2]} rotation={[0.4, 0.2, -0.1]} color="#5a3010" />
            <DebrisPiece position={[-5.0, 0.06, -0.3]} size={[0.15, 0.12, 0.15]} rotation={[0.2, 1.2, 0.3]} color="#8B4513" />
            <DebrisPiece position={[-4.5, 0.1, 0.2]} size={[0.22, 0.16, 0.2]} rotation={[-0.1, 0.6, 0.2]} color="#6a3a15" />
            <DebrisPiece position={[-5.3, 0.05, -0.5]} size={[0.12, 0.08, 0.1]} rotation={[0.5, 0.3, 0.1]} color="#888888" />

            {/* Larger debris pieces - fallen brick chunks */}
            <DebrisPiece position={[-4.6, 0.15, 0.9]} size={[0.4, 0.25, 0.3]} rotation={[0.2, 0.4, 0.15]} color="#7a3a10" />
            <DebrisPiece position={[-5.1, 0.2, 1.4]} size={[0.35, 0.3, 0.25]} rotation={[-0.15, 0.9, 0.1]} color="#8B4513" />

            {/* Glass shards from car and building windows */}
            <mesh position={[-5.0, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0.3]}>
                <planeGeometry args={[0.15, 0.1]} />
                <meshStandardMaterial
                    color="#a4d4e8"
                    transparent
                    opacity={0.6}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh position={[-5.3, 0.02, 0.8]} rotation={[-Math.PI / 2, 0, 0.8]}>
                <planeGeometry args={[0.12, 0.08]} />
                <meshStandardMaterial
                    color="#c8dce8"
                    transparent
                    opacity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh position={[-4.7, 0.02, 0.3]} rotation={[-Math.PI / 2, 0, 1.2]}>
                <planeGeometry args={[0.1, 0.06]} />
                <meshStandardMaterial
                    color="#a4d4e8"
                    transparent
                    opacity={0.7}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Dust/dirt pile near impact */}
            <mesh position={[-5.5, 0.05, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 16]} />
                <meshStandardMaterial color="#8a7a6a" roughness={1} />
            </mesh>
            <mesh position={[-5.2, 0.04, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 12]} />
                <meshStandardMaterial color="#9a8a7a" roughness={1} />
            </mesh>

            {/* Tire marks/skid marks leading to crash */}
            <mesh position={[-4, 0.01, 1]} rotation={[-Math.PI / 2, 0, -0.5]}>
                <planeGeometry args={[0.3, 3]} />
                <meshStandardMaterial color="#1a1a1a" transparent opacity={0.4} roughness={1} depthWrite={false} />
            </mesh>
            <mesh position={[-3.5, 0.01, 1.4]} rotation={[-Math.PI / 2, 0, -0.5]}>
                <planeGeometry args={[0.25, 2.5]} />
                <meshStandardMaterial color="#1a1a1a" transparent opacity={0.35} roughness={1} depthWrite={false} />
            </mesh>

            {/* Bumper/car parts that fell off */}
            <Box args={[0.6, 0.08, 0.15]} position={[-4.2, 0.04, 1.5]} rotation={[0, 0.8, 0.1]} castShadow>
                <meshStandardMaterial color="#1e4c7c" metalness={0.5} roughness={0.4} />
            </Box>

            {/* Broken headlight lens */}
            <Cylinder args={[0.08, 0.08, 0.02, 8]} position={[-4.5, 0.01, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#fffacd" transparent opacity={0.6} />
            </Cylinder>
        </group>
    );
}
