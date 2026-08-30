
interface BuildingProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    width?: number;
    height?: number;
    depth?: number;
    color?: string;
    hasBalconies?: boolean;
    isCommercial?: boolean;
    hasBillboard?: boolean;
}

function Building({
    position,
    rotation = [0, 0, 0],
    width = 3,
    height = 5,
    depth = 3,
    color = '#888888',
    hasBalconies = false,
    isCommercial = false,
    hasBillboard = false
}: BuildingProps) {
    const floors = Math.floor(height / 1.5);

    return (
        <group position={position} rotation={rotation}>
            {/* Main building */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>

            {/* Roof with trim */}
            <mesh position={[0, height / 2 + 0.1, 0]} castShadow>
                <boxGeometry args={[width + 0.4, 0.2, depth + 0.4]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
            </mesh>
            <mesh position={[0, height / 2 + 0.3, 0]} castShadow>
                <boxGeometry args={[width + 0.1, 0.2, depth + 0.1]} />
                <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>

            {/* Windows with frames and sills */}
            {Array.from({ length: floors }).map((_, floor) => {
                const windowsPerRow = Math.floor(width / 0.8);
                const startPos = -(windowsPerRow - 1) * 0.8 / 2;

                return (
                    <group key={floor}>
                        {/* Front windows skip center window on ground floor where door is */}
                        { }
                        {Array.from({ length: windowsPerRow }).map((_, i) => {
                            const windowX = startPos + i * 0.8;
                            // Skip windows that overlap with the door (center) on ground floor
                            if (floor === 0 && Math.abs(windowX) < 0.5) return null;
                            // Skip floors 1-2 for billboard buildings (floor 3+ shows above billboard)
                            if (hasBillboard && (floor === 1 || floor === 2)) return null;
                            return (
                                <group key={`front-${i}`} position={[windowX, -height / 2 + 1 + floor * 1.5, depth / 2]}>
                                    {/* Window frame */}
                                    <mesh position={[0, 0, 0.011]}>
                                        <planeGeometry args={[0.6, 0.8]} />
                                        <meshStandardMaterial color="#2a2a2a" />
                                    </mesh>

                                    {/* Window Sill */}
                                    <mesh position={[0, -0.45, 0.05]} castShadow>
                                        <boxGeometry args={[0.7, 0.1, 0.15]} />
                                        <meshStandardMaterial color="#3a3a3a" />
                                    </mesh>

                                    {/* Window glass */}
                                    <mesh position={[0, 0, 0.02]}>
                                        <planeGeometry args={[0.52, 0.72]} />
                                        <meshStandardMaterial
                                            color="#87ceeb"
                                            emissive={floor > 0 ? "#ffeaa7" : "#87ceeb"}
                                            emissiveIntensity={floor > 0 ? 0.3 : 0.15}
                                            transparent
                                            opacity={0.7}
                                            metalness={0.5}
                                        />
                                    </mesh>
                                </group>
                            );
                        })}

                        {/* Back windows */}
                        {Array.from({ length: windowsPerRow }).map((_, i) => (
                            <group
                                key={`back-${i}`}
                                position={[startPos + i * 0.8, -height / 2 + 1 + floor * 1.5, -depth / 2]}
                                rotation={[0, Math.PI, 0]}
                            >
                                {/* Window frame */}
                                <mesh position={[0, 0, 0.011]}>
                                    <planeGeometry args={[0.6, 0.8]} />
                                    <meshStandardMaterial color="#2a2a2a" />
                                </mesh>

                                {/* Window Sill */}
                                <mesh position={[0, -0.45, 0.05]} castShadow>
                                    <boxGeometry args={[0.7, 0.1, 0.15]} />
                                    <meshStandardMaterial color="#3a3a3a" />
                                </mesh>

                                {/* Window glass */}
                                <mesh position={[0, 0, 0.02]}>
                                    <planeGeometry args={[0.52, 0.72]} />
                                    <meshStandardMaterial
                                        color="#87ceeb"
                                        emissive="#87ceeb"
                                        emissiveIntensity={0.1}
                                        transparent
                                        opacity={0.7}
                                    />
                                </mesh>
                            </group>
                        ))}

                        {/* Balconies for residential buildings skip for billboard buildings */}
                        {hasBalconies && floor > 0 && !hasBillboard && (
                            <mesh position={[0, -height / 2 + 0.5 + floor * 1.5, depth / 2 + 0.3]} castShadow>
                                <boxGeometry args={[width * 0.8, 0.05, 0.5]} />
                                <meshStandardMaterial color="#5a5a5a" metalness={0.4} />
                            </mesh>
                        )}
                    </group>
                );
            })}

            {/* Ground floor door (only on front) */}
            <group position={[0, -height / 2 + 0.9, depth / 2]}>
                {/* Door frame */}
                <mesh position={[0, 0, 0.011]}>
                    <planeGeometry args={[0.8, 1.8]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* Door */}
                <mesh position={[0, 0, 0.02]}>
                    <planeGeometry args={[0.7, 1.7]} />
                    <meshStandardMaterial
                        color={isCommercial ? "#3a3a3a" : "#4a2a1a"}
                        roughness={0.7}
                        metalness={0.2}
                    />
                </mesh>

                {/* Door handle */}
                <mesh position={[0.25, 0, 0.03]} castShadow>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
                </mesh>
            </group>

            {/* Commercial storefront*/}
            {
                isCommercial && (
                    <>
                        {/* Large storefront window */}
                        <mesh position={[0, -height / 2 + 1.2, depth / 2 + 0.015]}>
                            <planeGeometry args={[width * 0.9, 2]} />
                            <meshStandardMaterial
                                color="#e0f7ff"
                                transparent
                                opacity={0.5}
                                metalness={0.7}
                                roughness={0.1}
                            />
                        </mesh>

                        { }
                        <mesh position={[0, -height / 2 + 2.0, depth / 2 + 0.3]} castShadow>
                            <boxGeometry args={[width * 0.95, 0.05, 0.6]} />
                            <meshStandardMaterial color="#cc3333" roughness={0.9} />
                        </mesh>
                    </>
                )
            }

            {/* AC units on sides (random placement) */}
            {
                Array.from({ length: Math.max(1, floors - 1) }).map((_, i) => (
                    <mesh
                        key={`ac-${i}`}
                        position={[width / 2 + 0.1, -height / 2 + 1.5 + i * 1.5, 0]}
                        castShadow
                    >
                        <boxGeometry args={[0.15, 0.3, 0.4]} />
                        <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.8} />
                    </mesh>
                ))
            }
        </group >
    );
}

export function Buildings() {
    // Building configurations (left side of road) Mixed residential and commercial
    const leftBuildings = [
        { pos: [-8, 2.5, 0], w: 4, h: 5, d: 4, c: '#8B4513', balconies: true, commercial: false }, // Brick Red
        { pos: [-8, 4, -5], w: 3, h: 8, d: 3, c: '#F5F5DC', balconies: false, commercial: false }, // Beige
        { pos: [-8, 3, -10], w: 5, h: 6, d: 4, c: '#E2725B', balconies: true, commercial: false }, // Terracotta
        { pos: [-8, 5, -15], w: 3, h: 10, d: 3, c: '#C0C0C0', balconies: true, commercial: false }, // Silver/Grey
        { pos: [-8, 3.5, -20], w: 4, h: 7, d: 4, c: '#2F4F4F', balconies: false, commercial: true }, // Dark Slate Grey
        { pos: [-8, 4.5, -25], w: 3.5, h: 9, d: 3.5, c: '#D2B48C', balconies: true, commercial: false }, // Tan
        { pos: [-8, 3, 5], w: 4, h: 6, d: 4, c: '#A0522D', balconies: false, commercial: true }, // Sienna
        { pos: [-8, 5, 10], w: 3, h: 10, d: 3, c: '#708090', balconies: true, commercial: false }, // Slate Grey
        { pos: [-8, 4, 15], w: 5, h: 8, d: 4, c: '#BC8F8F', balconies: false, commercial: false }, // Rosy Brown
        { pos: [-8, 3.5, 20], w: 4, h: 7, d: 4, c: '#CD853F', balconies: true, commercial: false }, // Peru
    ];

    // Building configurations (right side of road)Mixed residential and commercial
    const rightBuildings = [
        { pos: [8, 4.5, -2.5], w: 3.5, h: 9, d: 3.5, c: '#DEB887', balconies: true, commercial: false, billboard: true }, // Burlywood - has task billboard (taller building)
        { pos: [8, 5.5, -7.5], w: 4, h: 11, d: 4, c: '#696969', balconies: true, commercial: false }, // Dim Grey
        { pos: [8, 2.5, -12.5], w: 5, h: 5, d: 5, c: '#BDB76B', balconies: false, commercial: true }, // Dark Khaki
        { pos: [8, 4, -17.5], w: 3, h: 8, d: 3, c: '#F0E68C', balconies: false, commercial: false }, // Khaki
        { pos: [8, 3, -22.5], w: 4, h: 6, d: 4, c: '#556B2F', balconies: true, commercial: true }, // Dark Olive Green
        { pos: [8, 6, -27.5], w: 3, h: 12, d: 3, c: '#808000', balconies: true, commercial: false }, // Olive
        { pos: [8, 4, 2.5], w: 4, h: 8, d: 4, c: '#8FBC8F', balconies: false, commercial: true }, // Dark Sea Green
        { pos: [8, 3, 7.5], w: 5, h: 6, d: 5, c: '#4682B4', balconies: false, commercial: false }, // Steel Blue
        { pos: [8, 5, 12.5], w: 3, h: 10, d: 3, c: '#B0C4DE', balconies: true, commercial: false }, // Light Steel Blue
        { pos: [8, 4.5, 17.5], w: 4, h: 9, d: 4, c: '#778899', balconies: true, commercial: false }, // Light Slate Grey
    ];

    return (
        <>
            {/* Buildings Left side */}
            {leftBuildings.map((building, i) => (
                <Building
                    key={`left-${i}`}
                    position={building.pos as [number, number, number]}
                    rotation={[0, Math.PI / 2, 0]}
                    width={building.w}
                    height={building.h}
                    depth={building.d}
                    color={building.c}
                    hasBalconies={building.balconies}
                    isCommercial={building.commercial}
                />
            ))}

            {/* Buildings Right side */}
            {rightBuildings.map((building, i) => (
                <Building
                    key={`right-${i}`}
                    position={building.pos as [number, number, number]}
                    rotation={[0, -Math.PI / 2, 0]}
                    width={building.w}
                    height={building.h}
                    depth={building.d}
                    color={building.c}
                    hasBalconies={building.balconies}
                    isCommercial={building.commercial}
                    hasBillboard={building.billboard}
                />
            ))}

            {/* Buildings along curved sections Front curve*/}
            {[0, 1, 2, 3, 4].map((i) => {
                const arcRadius = 25;
                const arcAngle = Math.PI / 2.5;
                const angle = ((i + 0.5) / 5) * arcAngle;
                const z = 22 + arcRadius * Math.sin(angle);
                const x = arcRadius * (1 - Math.cos(angle));
                const rotation = angle;

                // Alternate building styles from existing ones
                const styles = [
                    { h: 6, w: 4, d: 4, c: '#8B4513', balconies: true, commercial: false },
                    { h: 8, w: 3, d: 3, c: '#F5F5DC', balconies: false, commercial: false },
                    { h: 7, w: 4, d: 4, c: '#708090', balconies: true, commercial: true },
                    { h: 5, w: 5, d: 5, c: '#BC8F8F', balconies: false, commercial: false },
                    { h: 9, w: 3, d: 3, c: '#D2B48C', balconies: true, commercial: false },
                ];
                const style = styles[i];

                return (
                    <group key={`curve-front-${i}`}>
                        {/* Left side of curved road */}
                        <Building
                            position={[-10 + x, style.h / 2, z]}
                            rotation={[0, Math.PI / 2 + rotation, 0]}
                            width={style.w}
                            height={style.h}
                            depth={style.d}
                            color={style.c}
                            hasBalconies={style.balconies}
                            isCommercial={style.commercial}
                        />
                        {/* Right side of curved road */}
                        <Building
                            position={[10 + x, style.h / 2, z]}
                            rotation={[0, -Math.PI / 2 + rotation, 0]}
                            width={style.w}
                            height={style.h}
                            depth={style.d}
                            color={styles[(i + 2) % 5].c}
                            hasBalconies={styles[(i + 2) % 5].balconies}
                            isCommercial={styles[(i + 2) % 5].commercial}
                        />
                    </group>
                );
            })}

            {/* Buildings along curved sections Back curve */}
            {[0, 1, 2, 3, 4].map((i) => {
                const arcRadius = 25;
                const arcAngle = Math.PI / 2.5;
                const angle = ((i + 0.5) / 5) * arcAngle;
                const z = -29 - arcRadius * Math.sin(angle);
                const x = -arcRadius * (1 - Math.cos(angle));
                const rotation = -angle;

                const styles = [
                    { h: 7, w: 4, d: 4, c: '#696969', balconies: true, commercial: false },
                    { h: 6, w: 5, d: 5, c: '#BDB76B', balconies: false, commercial: true },
                    { h: 8, w: 3, d: 3, c: '#F0E68C', balconies: false, commercial: false },
                    { h: 10, w: 3, d: 3, c: '#808000', balconies: true, commercial: false },
                    { h: 6, w: 4, d: 4, c: '#556B2F', balconies: true, commercial: true },
                ];
                const style = styles[i];

                return (
                    <group key={`curve-back-${i}`}>
                        {/* Left side of curved road */}
                        <Building
                            position={[-10 + x, style.h / 2, z]}
                            rotation={[0, Math.PI / 2 + rotation, 0]}
                            width={style.w}
                            height={style.h}
                            depth={style.d}
                            color={style.c}
                            hasBalconies={style.balconies}
                            isCommercial={style.commercial}
                        />
                        {/* Right side of curved road */}
                        <Building
                            position={[10 + x, style.h / 2, z]}
                            rotation={[0, -Math.PI / 2 + rotation, 0]}
                            width={style.w}
                            height={style.h}
                            depth={style.d}
                            color={styles[(i + 3) % 5].c}
                            hasBalconies={styles[(i + 3) % 5].balconies}
                            isCommercial={styles[(i + 3) % 5].commercial}
                        />
                    </group>
                );
            })}
        </>
    );
}
