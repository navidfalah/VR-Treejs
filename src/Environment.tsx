import { Sky, Cloud } from '@react-three/drei';
import { Fog } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export function Environment() {
    const { scene } = useThree();

    // Add fog for atmospheric depth
    useEffect(() => {
        scene.fog = new Fog('#b8d4e8', 30, 100);
    }, [scene]);

    return (
        <>
            {/* Enhanced Lighting System */}
            {/* Main ambient light - warmer tone for daytime */}
            <ambientLight intensity={0.7} color="#fff5e6" />

            {/* Main directional sunlight */}
            <directionalLight
                position={[20, 30, 10]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-bias={-0.0001}
                color="#fff8e1"
            />

            {/* Fill light for softer shadows */}
            <directionalLight
                position={[-10, 20, -10]}
                intensity={0.3}
                color="#e3f2fd"
            />



            {/* Beautiful Enhanced Sky */}
            <Sky
                distance={450000}
                sunPosition={[100, 20, 100]}
                inclination={0.52}
                azimuth={0.25}
                turbidity={2}
                rayleigh={1}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
            />

            {/* Clouds - 2 centered over crashed car */}
            <Cloud position={[-6, 16, 0]} speed={0.2} opacity={0.5} segments={20} />
            <Cloud position={[-4, 18, 2]} speed={0.25} opacity={0.55} segments={22} />

            {/* Clouds - 2 following street direction (along Z axis) */}
            <Cloud position={[0, 17, -25]} speed={0.2} opacity={0.5} segments={20} />
            <Cloud position={[0, 15, 25]} speed={0.22} opacity={0.5} segments={22} />

            {/* Multi-zone Ground */}
            {/* Main ground - darker dirt/gravel */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[120, 120]} />
                <meshStandardMaterial
                    color="#4a4438"
                    roughness={0.95}
                    metalness={0.1}
                />
            </mesh>

            {/* Grass areas on left side */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -0.05, -20]} receiveShadow>
                <planeGeometry args={[20, 30]} />
                <meshStandardMaterial
                    color="#3a5a2a"
                    roughness={0.95}
                />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -0.05, 10]} receiveShadow>
                <planeGeometry args={[20, 30]} />
                <meshStandardMaterial
                    color="#2f4a1f"
                    roughness={0.95}
                />
            </mesh>

            {/* Grass areas on right side */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.05, -15]} receiveShadow>
                <planeGeometry args={[20, 40]} />
                <meshStandardMaterial
                    color="#35521f"
                    roughness={0.95}
                />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.05, 8]} receiveShadow>
                <planeGeometry args={[20, 28]} />
                <meshStandardMaterial
                    color="#2d4a18"
                    roughness={0.95}
                />
            </mesh>

            {/* Dirt patches for variation */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, -0.04, 15]} receiveShadow>
                <circleGeometry args={[3, 32]} />
                <meshStandardMaterial
                    color="#5a4a38"
                    roughness={0.9}
                />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, -0.04, -25]} receiveShadow>
                <circleGeometry args={[4, 32]} />
                <meshStandardMaterial
                    color="#4f4232"
                    roughness={0.9}
                />
            </mesh>
        </>
    );
}
