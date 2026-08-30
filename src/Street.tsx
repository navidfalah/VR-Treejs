// Curved road section that bends horizontally to hide map edge
function CurvedRoadEnd({ position, rotationY = 0, curveDirection = 1 }: { position: [number, number, number]; rotationY?: number; curveDirection?: number }) {
    const segments = 10;
    const arcRadius = 25;
    const arcAngle = Math.PI / 2.5;
    const roadWidth = 10;
    const sidewalkWidth = 2;
    const segmentLength = (arcRadius * arcAngle) / segments;

    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            {Array.from({ length: segments }).map((_, i) => {
                const angle = (i / segments) * arcAngle;
                const nextAngle = ((i + 1) / segments) * arcAngle;
                const midAngle = (angle + nextAngle) / 2;

                // Position along the arc 
                const z = arcRadius * Math.sin(midAngle);
                const x = curveDirection * arcRadius * (1 - Math.cos(midAngle));

                // Rotation to follow the curve (turning left/right)
                const turnAngle = curveDirection * midAngle;

                return (
                    <group key={i} position={[x, 0, z]} rotation={[0, turnAngle, 0]}>
                        {/* Road segment */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[roadWidth, segmentLength * 1.05]} />
                            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                        </mesh>

                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.07, 0]} receiveShadow>
                            <planeGeometry args={[sidewalkWidth, segmentLength * 1.05]} />
                            <meshStandardMaterial color="#909090" roughness={0.8} />
                        </mesh>

                        <mesh position={[-4, 0.075, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.15, 0.15, segmentLength * 1.05]} />
                            <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
                        </mesh>

                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.07, 0]} receiveShadow>
                            <planeGeometry args={[sidewalkWidth, segmentLength * 1.05]} />
                            <meshStandardMaterial color="#909090" roughness={0.8} />
                        </mesh>

                        <mesh position={[4, 0.075, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.15, 0.15, segmentLength * 1.05]} />
                            <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

export function Street() {
    const streetLength = 51;
    const streetCenter = -3.5;

    return (
        <>
            {/* Road Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, streetCenter]} receiveShadow>
                <planeGeometry args={[10, streetLength]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            {/* Sidewalks with 3D curbs */}
            {/* Left sidewalk */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.07, streetCenter]} receiveShadow>
                <planeGeometry args={[2, streetLength]} />
                <meshStandardMaterial color="#909090" roughness={0.8} />
            </mesh>

            {/* Left curb */}
            <mesh position={[-4, 0.075, streetCenter]} castShadow receiveShadow>
                <boxGeometry args={[0.15, 0.15, streetLength]} />
                <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
            </mesh>

            {/* Right sidewalk */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.07, streetCenter]} receiveShadow>
                <planeGeometry args={[2, streetLength]} />
                <meshStandardMaterial color="#909090" roughness={0.8} />
            </mesh>

            {/* Right curb */}
            <mesh position={[4, 0.075, streetCenter]} castShadow receiveShadow>
                <boxGeometry args={[0.15, 0.15, streetLength]} />
                <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
            </mesh>

            {/* Curved road ends to hide map edges */}
            <CurvedRoadEnd position={[0, 0, 22]} rotationY={0} />

            {/* Negative Z end (back) - right after last building */}
            <CurvedRoadEnd position={[0, 0, -29]} rotationY={Math.PI} />
        </>
    );
}
