import { Environment } from './Environment';
import { HighFidelityCar } from './HighFidelityCar';
import { CrashDamage } from './CrashDamage';
import { Person } from './Person';
import { PlayerController } from './PlayerController';
import { VRHandControllers } from './VRHandControllers';
import { VRHeldItems } from './VRHeldItems';
import { ParticleEffects } from './ParticleEffects';
import { Buildings } from './Buildings';
import { Street } from './Street';
import { EnvironmentalProps } from './EnvironmentalProps';
import { Bus } from './Bus';
import { ParkedCar } from './ParkedCar';
import { EmergencyPhone } from './EmergencyPhone';
import { useStore } from './store';
import { PlacedWarningTriangle } from './WarningTriangle';
import { TaskBillboard } from './TaskBillboard';
import { VRPhone } from './VRPhone';
import { PlacedFirstAidKit } from './FirstAidKit';
import { BandagingSystem, DesktopBandaging } from './BandagingSystem';
import type { ThreeEvent } from '@react-three/fiber';

function BloodStain({ position }: { position: [number, number, number] }) {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.4, 32]} />
            <meshStandardMaterial
                color="#8a0303"
                transparent
                opacity={0.8}
                roughness={0.2}
                metalness={0.5}
                depthWrite={false}
            />
        </mesh>
    );
}

// Invisible ground plane for click-to-place interactions
function InteractiveGround() {
    const hasWarningTriangle = useStore((state) => state.hasWarningTriangle);
    const placeTriangle = useStore((state) => state.placeTriangle);
    const hasFirstAidKit = useStore((state) => state.hasFirstAidKit);
    const isFirstAidKitPlaced = useStore((state) => state.isFirstAidKitPlaced);
    const placeFirstAidKit = useStore((state) => state.placeFirstAidKit);

    const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (hasWarningTriangle) {
            placeTriangle(e.point);
        } else if (hasFirstAidKit && !isFirstAidKitPlaced) {
            placeFirstAidKit(e.point);
        }
    };

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
            onClick={handleGroundClick}
        >
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial visible={false} />
        </mesh>
    );
}

export function GameScene() {
    const currentLevel = useStore((state) => state.currentLevel);

    return (
        <>
            <InteractiveGround />
            <Environment />
            <Street />
            <Buildings />
            <EnvironmentalProps />
            <PlayerController />
            <VRHandControllers />
            <VRHeldItems />
            <VRPhone />
            <TaskBillboard />

            {/* Crashed car in accident scene with fire - hitting building on left */}
            <group>
                <HighFidelityCar position={[-5.8, 0, 0]} rotation={[0, -1.2, 0]} />
                {/* Fire only in Level 2 */}
                {currentLevel === 2 && (
                    <>
                        <ParticleEffects position={[-5.8, 0.5, 0]} type="fire" />
                        <ParticleEffects position={[-5.6, 0.8, 0.2]} type="smoke" />
                    </>
                )}
            </group>

            {/* Crash damage - broken building wall, debris, and impact effects */}
            <CrashDamage />

            {/* Injured person lying further from car with blood */}
            <group>
                <Person position={[-4, 0, 2]} rotation={[0, Math.PI / 1.5, 0]} />
                <BloodStain position={[-4, 0.01, 2]} />
                <BloodStain position={[-3.7, 0.01, 1.7]} />
            </group>

            {/* Placed warning triangle */}
            <PlacedWarningTriangle />

            {/* Placed first aid kit on ground */}
            <PlacedFirstAidKit />

            {/* Bandaging system for VR and Desktop */}
            <BandagingSystem />
            <DesktopBandaging />

            {/* City buses at bus stops */}
            {/* Right side bus stop*/}
            <Bus position={[2, 0, 16]} rotation={Math.PI} />
            {/* Left side bus stop*/}
            <Bus position={[-2, 0, -32]} rotation={0} color="#e8c940" />

            <ParkedCar position={[1.5, 0, -8]} rotation={Math.PI} color="#cc3333" driverShirtColor="#3a5a8a" hasPassenger={false} />
            <ParkedCar position={[1.5, 0, -16]} rotation={Math.PI} color="#2a5a8a" driverShirtColor="#5a5a5a" hasPassenger={true} />
            <ParkedCar position={[1.5, 0, -24]} rotation={Math.PI} color="#4a4a4a" driverShirtColor="#8a4a3a" hasPassenger={false} />

            {/* Left driving lane */}
            <ParkedCar position={[-1.5, 0, 10]} rotation={0} color="#f5f5f5" driverShirtColor="#5a3a8a" hasPassenger={true} />
            <ParkedCar position={[-1.5, 0, -10]} rotation={0} color="#2d5a27" driverShirtColor="#3a3a3a" hasPassenger={false} />

            {/* Emergency Phone*/}
            <EmergencyPhone position={[-4.4, 0, -5]} />
        </>
    );
}
