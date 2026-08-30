import { Box, Cylinder, Text } from '@react-three/drei';
import { useStore } from './store';
import { useState } from 'react';

const dialogSteps = [
    {
        dispatcher: "Emergency 112. Where exactly is the accident?",
        options: [
            "Main street",
            "Highway",
            "I don't know exactly"
        ]
    },
    {
        dispatcher: "What exactly happened?",
        options: [
            "Person hit by a vehicle",
            "Vehicle fire",
            "Traffic accident"
        ]
    },
    {
        dispatcher: "How many injured people?",
        options: [
            "One Person Injured",
            "Multiple people",
            "Only property damage"
        ]
    },
    {
        dispatcher: "What injuries do you see?",
        options: [
            "No visible wounds",
            "Unconscious, bleeding",
            "Head injury"
        ]
    },
    {
        dispatcher: "Ambulance is on the way! \n Provide first aid.",
        options: ["Understood, \n I'll help immediately!"]
    }
];

interface EmergencyPhoneProps {
    position: [number, number, number];
}

export function EmergencyPhone({ position }: EmergencyPhoneProps) {
    const callEMS = useStore((state) => state.callEMS);

    // Local state
    const [isActive, setIsActive] = useState(false);
    const [dialogStep, setDialogStep] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Always show
    const shouldShow = true;

    const handlePhoneClick = () => {
        if (!isActive) setIsActive(true);
    };

    const handleResponse = () => {
        if (dialogStep < dialogSteps.length - 1) {
            setDialogStep(s => s + 1);
        } else {
            callEMS();
            setIsActive(false);
            setDialogStep(0);
        }
    };

    if (!shouldShow) return null;

    const currentDialog = dialogSteps[dialogStep];

    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}> {/* Rotation to face street */}

            {/* --- INVISIBLE HITBOX FOR EASY CLICKING --- */}
            <Box
                args={[0.8, 2.0, 0.8]}
                position={[0, 1, 0]}
                visible={false} // Invisible but raycastable
                onClick={handlePhoneClick}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
            />

            {/* --- Pedestal Phone --- */}

            {/* 1. The Pole (Silver) */}
            <Cylinder args={[0.06, 0.06, 1.4, 16]} position={[0, 0.7, 0]} onClick={handlePhoneClick}>
                <meshStandardMaterial color="#888899" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.05, 16]} position={[0, 0.025, 0]}>
                <meshStandardMaterial color="#333" />
            </Cylinder>

            {/* 2. Main Housing (Dark Grey/Blue) */}
            <group position={[0, 1.4, 0]} onClick={handlePhoneClick}>
                {/* Back Plate */}
                <Box args={[0.4, 0.6, 0.1]} position={[0, 0, -0.05]}>
                    <meshStandardMaterial color="#2c3e50" />
                </Box>
                {/* Sloped Front Face */}
                <Box args={[0.36, 0.56, 0.05]} position={[0, 0, 0.02]}>
                    <meshStandardMaterial color="#34495e" />
                </Box>

                {/* Keypad Area */}
                <Box args={[0.2, 0.25, 0.01]} position={[0, -0.1, 0.05]}>
                    <meshStandardMaterial color="#95a5a6" />
                </Box>
                {/* Buttons (Visual only) */}
                {[...Array(9)].map((_, i) => (
                    <Box
                        key={i}
                        args={[0.04, 0.04, 0.01]}
                        position={[((i % 3) - 1) * 0.06, 0.08 - Math.floor(i / 3) * 0.06 - 0.1, 0.06]}
                    >
                        <meshStandardMaterial color="#222" />
                    </Box>
                ))}

                {/* Top Label "SOS" */}
                <Box args={[0.3, 0.1, 0.02]} position={[0, 0.2, 0.05]}>
                    <meshStandardMaterial color="#c0392b" />
                </Box>
                <Text position={[0, 0.2, 0.07]} fontSize={0.06} color="white">
                    SOS
                </Text>
            </group>

            {/* 3. Handset (Red) */}
            <group
                position={[-0.25, 1.4, 0]}
                rotation={[0, 0, 0.2]}
                onClick={handlePhoneClick}
            >
                {/* Handle */}
                <Box args={[0.06, 0.25, 0.05]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={isHovered ? "#ff6666" : "#c0392b"} />
                </Box>
                {/* Top Ear Piece */}
                <Box args={[0.08, 0.08, 0.06]} position={[0, 0.15, 0.01]}>
                    <meshStandardMaterial color={isHovered ? "#ff6666" : "#c0392b"} />
                </Box>
                {/* Bottom Main Piece */}
                <Box args={[0.08, 0.08, 0.06]} position={[0, -0.15, 0.01]}>
                    <meshStandardMaterial color={isHovered ? "#ff6666" : "#c0392b"} />
                </Box>

                {/* Floating hint */}
                {isHovered && !isActive && (
                    <Text position={[0.2, 0, 0.2]} fontSize={0.05} color="white" renderOrder={1}>
                        Click to Call
                    </Text>
                )}
            </group>

            {/* 4. Cord (Decorative) -> Simple spline logic or thin boxes */}


            {/* --- 3D UI Panel --- */}
            {isActive && (
                <group position={[0.5, 1.6, 0]} rotation={[0, -Math.PI / 6, 0]}>
                    {/* Connecting Arm */}
                    <Box args={[0.2, 0.02, 0.02]} position={[-0.15, 0, 0]}>
                        <meshStandardMaterial color="#888" />
                    </Box>

                    <Box args={[0.7, 0.9, 0.03]} position={[0.3, 0, 0]}>
                        <meshStandardMaterial color="#2c3e50" />
                    </Box>

                    <group position={[0.3, -0.1, 0.02]}>
                        <Text position={[0, 0.35, 0]} fontSize={0.06} color="#3cf" maxWidth={0.6} textAlign="center">
                            {currentDialog.dispatcher}
                        </Text>
                        {currentDialog.options.map((opt, i) => (
                            <group key={i} position={[0, 0.15 - i * 0.15, 0]} onClick={handleResponse}>
                                <Box
                                    args={[0.55, 0.12, 0.01]}
                                    onPointerOver={() => setHoveredIdx(i)}
                                    onPointerOut={() => setHoveredIdx(null)}
                                >
                                    <meshStandardMaterial color={hoveredIdx === i ? "#27ae60" : "#2ecc71"} />
                                </Box>
                                <Text position={[0, 0, 0.01]} fontSize={0.045} color="white">
                                    {opt}
                                </Text>
                            </group>
                        ))}
                    </group>
                </group>
            )}
        </group>
    );
}
