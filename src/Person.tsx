import { useStore } from './store';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleEffects } from './ParticleEffects';

export function Person(props: any) {
    const hasBandage = useStore((state) => state.hasBandage);
    const isPersonHealed = useStore((state) => state.isPersonHealed);
    const checkBreathing = useStore((state) => state.checkBreathing);
    const healPerson = useStore((state) => state.healPerson);
    const setNearPerson = useStore((state) => state.setNearPerson);
    const setHoveredObject = useStore((state) => state.setHoveredObject);
    const playerPosition = useStore((state) => state.playerPosition);
    const currentObjective = useStore((state) => state.currentObjective);
    const breathingChecked = useStore((state) => state.breathingChecked);

    const checkPulse = useStore((state) => state.checkPulse);
    const applyPressure = useStore((state) => state.applyPressure);
    const pulseChecked = useStore((state) => state.pulseChecked);
    const pressureApplied = useStore((state) => state.pressureApplied);

    const groupRef = useRef<Group>(null);
    const [hovered, setHovered] = useState(false);
    const glowRef = useRef(0);

    useFrame((state) => {
        if (groupRef.current && props.position) {
            const personPos = new THREE.Vector3(...props.position);
            const distance = playerPosition.distanceTo(personPos);
            setNearPerson(distance < 3);
        }

        if (!isPersonHealed) {
            glowRef.current += 0.05;
        }

        // Breathing animation
        if (groupRef.current) {
            const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
            const torso = groupRef.current.getObjectByName('torso');
            if (torso) torso.scale.set(1, 1, breathingScale);
        }
    });

    const handleInteraction = () => {
        if (currentObjective === 'check_breathing' && !breathingChecked) {
            checkBreathing();
        } else if (currentObjective === 'check_pulse' && !pulseChecked) {
            checkPulse();
        } else if (currentObjective === 'apply_pressure' && !pressureApplied) {
            applyPressure();
        } else if (hasBandage && !isPersonHealed && (currentObjective === 'heal_person' || currentObjective === 'go_to_person')) {
            healPerson();
        }
    };

    const skinColor = isPersonHealed ? "#f4d0b0" : "#ffb5b5";
    const shirtColor = isPersonHealed ? "#4CAF50" : "#3b7cbd";
    const pantsColor = "#3a4a5a";
    const shoeColor = "#2a2a2a";
    const hairColor = "#4a3428";
    const emissiveIntensity = isPersonHealed ? 0 : Math.sin(glowRef.current) * 0.25 + 0.25;

    return (
        <group
            {...props}
            ref={groupRef}
            onClick={handleInteraction}
            onPointerOver={() => {
                setHovered(true);
                setHoveredObject('person');
            }}
            onPointerOut={() => {
                setHovered(false);
                setHoveredObject(null);
            }}
        >
            {/* HEAD */}
            <Sphere args={[0.22, 16, 16]} position={[0, 0.33, 0]} castShadow>
                <meshStandardMaterial
                    color={skinColor}
                    roughness={0.75}
                    emissive={isPersonHealed ? "#4CAF50" : "#ff0000"}
                    emissiveIntensity={emissiveIntensity}
                />
            </Sphere>

            {/* Hair */}
            <Sphere args={[0.23, 16, 16]} position={[0, 0.42, -0.04]} scale={[1, 0.75, 0.95]}>
                <meshStandardMaterial color={hairColor} roughness={0.88} />
            </Sphere>

            {/* Neck */}
            <Cylinder args={[0.08, 0.1, 0.12, 12]} position={[0, 0.18, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.75} />
            </Cylinder>

            {/* TORSO - Named for animation */}
            <Box name="torso" args={[0.5, 0.2, 0.68]} position={[0, 0.1, 0.48]} castShadow>
                <meshStandardMaterial color={shirtColor} roughness={0.82} />
            </Box>

            {/* Belt */}
            <Box args={[0.52, 0.05, 0.15]} position={[0, 0.02, 0.88]}>
                <meshStandardMaterial color="#4a3520" roughness={0.7} />
            </Box>

            {/* ARMS with Joints */}
            {/* Left arm */}
            <group position={[-0.35, 0.11, 0.32]}>
                {/* Upper Arm */}
                <Cylinder args={[0.07, 0.065, 0.25, 12]} rotation={[0, 0, Math.PI / 2.8]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.82} />
                </Cylinder>
                {/* Elbow Joint */}
                <Sphere args={[0.065, 12, 12]} position={[-0.22, -0.08, 0]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.82} />
                </Sphere>
                {/* Lower Arm */}
                <group position={[-0.22, -0.08, 0]} rotation={[0, 0, -0.2]}>
                    <Cylinder args={[0.065, 0.055, 0.25, 12]} rotation={[0, 0, Math.PI / 2.5]} position={[-0.12, -0.04, 0]}>
                        <meshStandardMaterial color={skinColor} roughness={0.75} />
                    </Cylinder>
                    {/* Hand */}
                    <Box args={[0.1, 0.06, 0.14]} position={[-0.25, -0.08, 0]} rotation={[0, 0, 0.2]}>
                        <meshStandardMaterial color={skinColor} roughness={0.75} />
                    </Box>
                </group>
            </group>

            {/* Right arm */}
            <group position={[0.35, 0.11, 0.32]}>
                {/* Upper Arm */}
                <Cylinder args={[0.07, 0.065, 0.25, 12]} rotation={[0, 0, -Math.PI / 2.8]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.82} />
                </Cylinder>
                {/* Elbow Joint */}
                <Sphere args={[0.065, 12, 12]} position={[0.22, -0.08, 0]}>
                    <meshStandardMaterial color={shirtColor} roughness={0.82} />
                </Sphere>
                {/* Lower Arm */}
                <group position={[0.22, -0.08, 0]} rotation={[0, 0, 0.2]}>
                    <Cylinder args={[0.065, 0.055, 0.25, 12]} rotation={[0, 0, -Math.PI / 2.5]} position={[0.12, -0.04, 0]}>
                        <meshStandardMaterial color={skinColor} roughness={0.75} />
                    </Cylinder>
                    {/* Hand */}
                    <Box args={[0.1, 0.06, 0.14]} position={[0.25, -0.08, 0]} rotation={[0, 0, -0.2]}>
                        <meshStandardMaterial color={skinColor} roughness={0.75} />
                    </Box>
                </group>
            </group>

            {/* LEGS with Knees */}
            {/* Left leg */}
            <group position={[-0.18, 0.08, 1.0]} rotation={[0, 0, -0.1]}>
                {/* Thigh */}
                <Cylinder args={[0.11, 0.09, 0.3, 12]} rotation={[Math.PI / 2.2, 0, 0]} position={[0, 0.05, 0.15]} castShadow>
                    <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </Cylinder>
                {/* Knee */}
                <Sphere args={[0.09, 12, 12]} position={[0, -0.02, 0.32]}>
                    <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </Sphere>
                {/* Shin */}
                <group position={[0, -0.02, 0.32]} rotation={[0.2, 0, 0]}>
                    <Cylinder args={[0.09, 0.075, 0.3, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0.15]}>
                        <meshStandardMaterial color={pantsColor} roughness={0.9} />
                    </Cylinder>
                    {/* Shoe */}
                    <Box args={[0.14, 0.1, 0.26]} position={[0, -0.08, 0.32]} rotation={[0.2, 0, 0]} castShadow>
                        <meshStandardMaterial color={shoeColor} roughness={0.8} />
                    </Box>
                </group>
            </group>

            {/* Right leg */}
            <group position={[0.18, 0.08, 1.0]} rotation={[0, 0, 0.1]}>
                {/* Thigh */}
                <Cylinder args={[0.11, 0.09, 0.3, 12]} rotation={[Math.PI / 2.4, 0, 0]} position={[0, 0.05, 0.15]} castShadow>
                    <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </Cylinder>
                {/* Knee */}
                <Sphere args={[0.09, 12, 12]} position={[0, -0.02, 0.32]}>
                    <meshStandardMaterial color={pantsColor} roughness={0.9} />
                </Sphere>
                {/* Shin */}
                <group position={[0, -0.02, 0.32]} rotation={[0.1, 0, 0]}>
                    <Cylinder args={[0.09, 0.075, 0.3, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0.15]}>
                        <meshStandardMaterial color={pantsColor} roughness={0.9} />
                    </Cylinder>
                    {/* Shoe */}
                    <Box args={[0.14, 0.1, 0.26]} position={[0, -0.08, 0.32]} rotation={[0.2, 0, 0]} castShadow>
                        <meshStandardMaterial color={shoeColor} roughness={0.8} />
                    </Box>
                </group>
            </group>

            {/* Hover highlight */}
            {hovered && (
                <mesh position={[0, 0.01, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.9, 1.05, 24]} />
                    <meshBasicMaterial
                        color={
                            currentObjective === 'check_breathing' ? "#00ffff" :
                                currentObjective === 'check_pulse' ? "#ff00ff" :
                                    currentObjective === 'apply_pressure' ? "#ff8800" :
                                        "#00ff00"
                        }
                        transparent
                        opacity={0.55}
                    />
                </mesh>
            )}

            {/* Pulse Indicator */}
            {pulseChecked && !isPersonHealed && (
                <mesh position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="#ff00ff" transparent opacity={0.6 + Math.sin(Date.now() * 0.01) * 0.4} />
                </mesh>
            )}

            {/* Pressure Indicator */}
            {pressureApplied && !isPersonHealed && (
                <mesh position={[0, 0.2, 0.5]} rotation={[-0.2, 0, 0]}>
                    <boxGeometry args={[0.3, 0.05, 0.3]} />
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
                </mesh>
            )}

            {/* Healing effects */}
            {isPersonHealed && (
                <ParticleEffects position={[0, 0.5, 0.5]} type="healing" />
            )}

            {/* Injury indicator */}
            {!isPersonHealed && (
                <pointLight
                    position={[0, 0.5, 0.5]}
                    color="#ff0000"
                    intensity={emissiveIntensity * 2}
                    distance={2.5}
                />
            )}
        </group>
    );
}
