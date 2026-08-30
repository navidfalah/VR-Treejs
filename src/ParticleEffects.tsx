import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffectsProps {
    position: [number, number, number];
    type: 'healing' | 'sparkle' | 'smoke' | 'fire';
    active?: boolean;
}

export function ParticleEffects({ position, type, active = true }: ParticleEffectsProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    const count = type === 'smoke' ? 50 : type === 'fire' ? 40 : 30;

    useEffect(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < count; i++) {
            if (type === 'smoke') {
                tempObject.position.set(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() * 2),
                    (Math.random() - 0.5) * 0.5
                );
                const scale = Math.random() * 0.5 + 0.2;
                tempObject.scale.set(scale, scale, scale);
            } else if (type === 'healing') {
                tempObject.position.set(
                    (Math.random() - 0.5) * 1,
                    (Math.random() * 1.5),
                    (Math.random() - 0.5) * 1
                );
                const scale = Math.random() * 0.1 + 0.05;
                tempObject.scale.set(scale, scale, scale);
            } else if (type === 'fire') {
                tempObject.position.set(
                    (Math.random() - 0.5) * 0.8,
                    Math.random() * 1.2,
                    (Math.random() - 0.5) * 0.8
                );
                const scale = Math.random() * 0.4 + 0.1;
                tempObject.scale.set(scale, scale, scale);
            }

            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, type, tempObject]);

    useFrame((state) => {
        if (!meshRef.current || !active) return;

        const time = state.clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            meshRef.current.getMatrixAt(i, tempObject.matrix);
            tempObject.matrix.decompose(tempObject.position, tempObject.quaternion, tempObject.scale);

            if (type === 'smoke') {
                tempObject.position.y += 0.01 + Math.random() * 0.01;
                tempObject.position.x += Math.sin(time + i) * 0.002;

                // Reset if too high
                if (tempObject.position.y > 3) {
                    tempObject.position.y = 0;
                    tempObject.position.x = (Math.random() - 0.5) * 0.5;
                    tempObject.position.z = (Math.random() - 0.5) * 0.5;
                }
            } else if (type === 'healing') {
                tempObject.position.y += 0.02;
                if (tempObject.position.y > 2) tempObject.position.y = 0;
            } else if (type === 'fire') {
                // Fire movement - fast upward, flickering
                tempObject.position.y += 0.03 + Math.random() * 0.02;
                tempObject.position.x += (Math.random() - 0.5) * 0.02;

                // Scale down as it rises
                const life = 1 - (tempObject.position.y / 1.5);
                const baseScale = 0.3 * life;
                if (baseScale > 0) tempObject.scale.set(baseScale, baseScale, baseScale);

                // Reset
                if (tempObject.position.y > 1.5 || baseScale <= 0) {
                    tempObject.position.y = 0;
                    tempObject.position.x = (Math.random() - 0.5) * 0.6;
                    tempObject.position.z = (Math.random() - 0.5) * 0.6;
                    tempObject.scale.set(0.3, 0.3, 0.3);
                }
            }

            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!active) return null;

    const color = type === 'smoke' ? '#555555' : type === 'healing' ? '#00ff00' : type === 'fire' ? '#ff4400' : '#ffcc00';
    const opacity = type === 'smoke' ? 0.4 : type === 'healing' ? 0.6 : type === 'fire' ? 0.8 : 0.8;
    const blending = type === 'fire' ? THREE.AdditiveBlending : THREE.NormalBlending;

    return (
        <group position={position}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                    depthWrite={false}
                    blending={blending}
                />
            </instancedMesh>
            {type === 'fire' && (
                <pointLight
                    color="#ff6600"
                    intensity={2}
                    distance={6}
                    decay={2}
                    position={[0, 0.5, 0]}
                />
            )}
        </group>
    );
}
