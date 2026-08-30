// Simple tree component
function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
                <meshStandardMaterial color="#4a3728" roughness={0.9} />
            </mesh>

            {/* Foliage - multiple spheres for fuller look */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.8, 8, 8]} />
                <meshStandardMaterial color="#2d5016" roughness={0.8} />
            </mesh>
            <mesh position={[0, 2, 0]} castShadow>
                <sphereGeometry args={[0.7, 8, 8]} />
                <meshStandardMaterial color="#3a6b1f" roughness={0.8} />
            </mesh>
            <mesh position={[0, 2.4, 0]} castShadow>
                <sphereGeometry args={[0.5, 8, 8]} />
                <meshStandardMaterial color="#4a7c2f" roughness={0.8} />
            </mesh>
        </group>
    );
}

// Park bench
function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Seat */}
            <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.2, 0.05, 0.4]} />
                <meshStandardMaterial color="#5a3a1a" />
            </mesh>

            {/* Backrest */}
            <mesh position={[0, 0.7, -0.15]} castShadow>
                <boxGeometry args={[1.2, 0.4, 0.05]} />
                <meshStandardMaterial color="#5a3a1a" />
            </mesh>

            {/* Legs */}
            {[-0.5, 0.5].map((x, i) => (
                <group key={i}>
                    <mesh position={[x, 0.2, 0.15]} castShadow>
                        <boxGeometry args={[0.05, 0.4, 0.05]} />
                        <meshStandardMaterial color="#333333" metalness={0.6} />
                    </mesh>
                    <mesh position={[x, 0.2, -0.15]} castShadow>
                        <boxGeometry args={[0.05, 0.4, 0.05]} />
                        <meshStandardMaterial color="#333333" metalness={0.6} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// Trash can
function TrashCan({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
                <meshStandardMaterial color="#2a4a2a" metalness={0.3} roughness={0.7} />
            </mesh>
            {/* Lid */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.05, 8]} />
                <meshStandardMaterial color="#1a3a1a" metalness={0.3} />
            </mesh>
        </group>
    );
}

// Fire hydrant
function FireHydrant({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Main body */}
            <mesh castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
                <meshStandardMaterial color="#cc3333" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Top dome */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#cc3333" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Side outlets */}
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.1, 6]} />
                <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.1, 6]} />
                <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>
        </group>
    );
}

// Bus stop shelter
function BusStop({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Back panel */}
            <mesh position={[0, 1.2, -0.4]} castShadow>
                <boxGeometry args={[2, 2, 0.05]} />
                <meshStandardMaterial color="#dddddd" transparent opacity={0.9} />
            </mesh>

            {/* Roof */}
            <mesh position={[0, 2.3, 0]} castShadow>
                <boxGeometry args={[2.2, 0.1, 1]} />
                <meshStandardMaterial color="#333333" metalness={0.5} />
            </mesh>

            {/* Support poles */}
            {[-0.9, 0.9].map((x, i) => (
                <mesh key={i} position={[x, 1.2, 0.4]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
                    <meshStandardMaterial color="#555555" metalness={0.6} />
                </mesh>
            ))}

            {/* Bench inside */}
            <mesh position={[0, 0.45, -0.2]} castShadow>
                <boxGeometry args={[1.6, 0.05, 0.35]} />
                <meshStandardMaterial color="#666666" metalness={0.3} />
            </mesh>
        </group>
    );
}

// Street sign
function StreetSign({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Pole */}
            <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
                <meshStandardMaterial color="#666666" metalness={0.5} />
            </mesh>

            {/* Sign board */}
            {/* Sign board */}
            <mesh position={[0, 2, 0.05]} castShadow>
                <boxGeometry args={[0.5, 0.5, 0.02]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Red border on sign */}
            <mesh position={[0, 2, 0.061]} castShadow>
                <ringGeometry args={[0.18, 0.22, 32]} />
                <meshStandardMaterial color="#dd0000" />
            </mesh>
        </group>
    );
}

// Mailbox
function Mailbox({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Base post */}
            <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                <meshStandardMaterial color="#333333" metalness={0.5} />
            </mesh>

            {/* Box - lowered to touch pole */}
            <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[0.3, 0.4, 0.25]} />
                <meshStandardMaterial color="#0056b3" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Top rounded part */}
            <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.125, 0.125, 0.3, 8]} />
                <meshStandardMaterial color="#0056b3" metalness={0.4} roughness={0.6} />
            </mesh>
        </group>
    );
}



export function EnvironmentalProps() {
    return (
        <>
            {/* Trees along left side - spaced away from accident scene */}
            <Tree position={[-7, 1, -12]} />
            <Tree position={[-7.5, 1, -20]} />
            <Tree position={[-7, 1, -28]} />
            <Tree position={[-7.5, 1, 6]} />
            <Tree position={[-7, 1, 12]} />
            <Tree position={[-7.5, 1, 18]} />

            {/* Trees along right side */}
            <Tree position={[7, 1, -10]} />
            <Tree position={[7.5, 1, -18]} />
            <Tree position={[7, 1, -26]} />
            <Tree position={[7.5, 1, 8]} />
            <Tree position={[7, 1, 15]} />

            {/* Benches on sidewalks - away from accident */}
            <Bench position={[-5, 0.05, -15]} rotation={Math.PI / 2} />
            <Bench position={[-5, 0.05, -25]} rotation={Math.PI / 2} />
            <Bench position={[5, 0.05, -14]} rotation={-Math.PI / 2} />
            <Bench position={[5, 0.05, -24]} rotation={-Math.PI / 2} />
            <Bench position={[-5, 0.05, 10]} rotation={Math.PI / 2} />
            <Bench position={[5, 0.05, 12]} rotation={-Math.PI / 2} />

            {/* Trash cans */}
            <TrashCan position={[-5.3, 0.3, -18]} />
            <TrashCan position={[-5.3, 0.3, -28]} />
            <TrashCan position={[5.3, 0.3, -16]} />
            <TrashCan position={[5.3, 0.3, -26]} />
            <TrashCan position={[-5.3, 0.3, 8]} />
            <TrashCan position={[5.3, 0.3, 10]} />

            {/* Fire hydrants - positioned near accident for realism */}
            <FireHydrant position={[5.5, 0.25, -7]} />
            <FireHydrant position={[-5.5, 0.25, -8]} />
            <FireHydrant position={[5.5, 0.25, 14]} />

            {/* Bus stops */}
            <BusStop position={[-5, 0.05, -32]} rotation={Math.PI / 2} />
            <BusStop position={[5, 0.05, 16]} rotation={-Math.PI / 2} />

            {/* Street signs */}
            <StreetSign position={[-4.5, 0, -11]} rotation={Math.PI / 4} />
            <StreetSign position={[4.5, 0, -22]} rotation={-Math.PI / 4} />
            <StreetSign position={[-4.5, 0, 13]} rotation={Math.PI / 3} />

            {/* Mailboxes */}
            <Mailbox position={[-5.4, 0, 5]} />
            <Mailbox position={[5.4, 0, -30]} />


        </>
    );
}
