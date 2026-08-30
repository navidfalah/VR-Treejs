import { Text, RoundedBox } from '@react-three/drei';
import { useXRInputSourceState } from '@react-three/xr';
import { useStore } from './store';
import { useRef, useEffect, useState } from 'react';
import { Group, Vector3, Euler, Quaternion, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';

// --- TYPES ---
type Screen = 'HOME' | 'DIALER' | 'CHAT';

type Message = {
    id: number;
    sender: 'dispatcher' | 'user';
    text: string;
};

// --- DATA ---
const dialogSteps = [
    {
        dispatcher: "Emergency 911. \n Where exactly is the accident?",
        options: ["Main street", "Highway", "I don't know exactly"]
    },
    {
        dispatcher: "What exactly happened?",
        options: ["Person hit by a vehicle", "Vehicle fire", "Traffic accident"]
    },
    {
        dispatcher: "How many injured people?",
        options: ["One Person Injured", "Multiple people", "Only property damage"]
    },
    {
        dispatcher: "What injuries do you see?",
        options: ["No visible wounds", "Unconscious, bleeding", "Head injury"]
    },
    {
        dispatcher: "Ambulance is on the way! \n Provide first aid.",
        options: ["Understood, \n I'll help immediately!"]
    }
];

// --- HELPER COMPONENTS ---

function TouchableButton({ onClick, width, height, color, hoverColor, children, position }: any) {
    const [hovered, setHovered] = useState(false);
    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
            <mesh visible={true}>
                <boxGeometry args={[width * 1.5, height * 2.0, 0.15]} />
                <meshBasicMaterial side={DoubleSide} transparent opacity={0} depthWrite={false} />
            </mesh>

            <RoundedBox args={[width, height, 0.001]} radius={0.005} smoothness={4}>
                <meshStandardMaterial color={hovered ? hoverColor : color} />
            </RoundedBox>
            {children}
        </group>
    );
}

function TypewriterText({ text, onComplete }: { text: string, onComplete?: () => void }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const speed = 20;

        const typeLoop = () => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                setTimeout(typeLoop, speed);
            } else {
                if (onComplete) onComplete();
            }
        };
        typeLoop();

        return () => { };
    }, [text]);

    return (
        <Text fontSize={0.007} color="black" maxWidth={0.08} anchorX="left" anchorY="top" textAlign="left">
            {displayedText}
        </Text>
    );
}

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Text position={[0, 0.08, 0.01]} fontSize={0.01} color="white">
            {timeString}
        </Text>
    );
}

// --- SCREENS ---

function HomeScreen({ onOpenApp }: { onOpenApp: (app: string) => void }) {
    return (
        <group>
            <Clock />

            {/* Phone App Icon */}
            <TouchableButton
                position={[-0.03, 0.04, 0.01]}
                width={0.035} height={0.035}
                color="#2ecc71" hoverColor="#4caf50"
                onClick={() => onOpenApp('DIALER')}
            >
                <Text position={[0, 0, 0.002]} fontSize={0.015} color="white">📞</Text>
            </TouchableButton>
            <Text position={[-0.03, 0.015, 0.01]} fontSize={0.006} color="white">Phone</Text>

            {/* Placeholder Apps */}
            <TouchableButton position={[0.03, 0.04, 0.01]} width={0.035} height={0.035} color="#34495e" hoverColor="#34495e" onClick={() => { }}>
                <Text position={[0, 0, 0.002]} fontSize={0.015} color="white">⚙️</Text>
            </TouchableButton>
            <Text position={[0.03, 0.015, 0.01]} fontSize={0.006} color="white">Settings</Text>

            <TouchableButton position={[-0.03, -0.02, 0.01]} width={0.035} height={0.035} color="#e67e22" hoverColor="#e67e22" onClick={() => { }}>
                <Text position={[0, 0, 0.002]} fontSize={0.015} color="white">📷</Text>
            </TouchableButton>
            <Text position={[-0.03, -0.045, 0.01]} fontSize={0.006} color="white">Camera</Text>
        </group>
    );
}

function DialerScreen({ onCall, onBack }: { onCall: (num: string) => void, onBack: () => void }) {
    const [number, setNumber] = useState("");

    const handlePress = (digit: string) => {
        if (number.length < 10) setNumber(prev => prev + digit);
    };
    const handleDelete = () => setNumber(prev => prev.slice(0, -1));

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    return (
        <group>
            {/* Number Display */}
            <Text position={[0, 0.07, 0.01]} fontSize={0.015} color="white">{number || "Enter Number"}</Text>

            {/* Keypad Grid */}
            {keys.map((key, i) => {
                const row = Math.floor(i / 3);
                const col = i % 3;
                return (
                    <TouchableButton
                        key={key}
                        position={[(col - 1) * 0.035, 0.03 - row * 0.025, 0.01]}
                        width={0.025} height={0.018}
                        color="#34495e" hoverColor="#4d6785"
                        onClick={() => handlePress(key)}
                    >
                        <Text position={[0, 0, 0.002]} fontSize={0.01} color="white">{key}</Text>
                    </TouchableButton>
                );
            })}

            {/* Call Button */}
            <TouchableButton
                position={[0, -0.07, 0.01]}
                width={0.06} height={0.025}
                color="#27ae60" hoverColor="#2ecc71"
                onClick={() => onCall(number)}
            >
                <Text position={[0, 0, 0.002]} fontSize={0.01} color="white">CALL</Text>
            </TouchableButton>

            {/* Back/Del Buttons */}
            <TouchableButton position={[-0.04, -0.07, 0.01]} width={0.025} height={0.015} color="#c0392b" hoverColor="#e74c3c" onClick={onBack}>
                <Text position={[0, 0, 0.002]} fontSize={0.007} color="white">BACK</Text>
            </TouchableButton>
            <TouchableButton position={[0.04, -0.07, 0.01]} width={0.025} height={0.015} color="#7f8c8d" hoverColor="#95a5a6" onClick={handleDelete}>
                <Text position={[0, 0, 0.002]} fontSize={0.007} color="white">DEL</Text>
            </TouchableButton>
        </group>
    );
}

function ChatScreen({ onHome }: { onHome: () => void }) {
    const callEMS = useStore(s => s.callEMS);
    const emsCalled = useStore(s => s.emsCalled);

    // Internal chat logic
    const [messages, setMessages] = useState<Message[]>([]);
    const [dialogIndex, setDialogIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [showOptions, setShowOptions] = useState(false);

    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;

        if (messages.length === 0 && !emsCalled) {
            addMessage('dispatcher', dialogSteps[0].dispatcher);
            initializedRef.current = true;
        } else if (emsCalled && messages.length === 0) {
            addMessage('dispatcher', "Call ended. Help is on the way.");
            setIsTyping(false);
            setShowOptions(false);
            initializedRef.current = true;
        }
    }, [messages.length, emsCalled]);

    const addMessage = (sender: 'dispatcher' | 'user', text: string) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, text }]);
        if (sender === 'dispatcher') {
            setIsTyping(true);
            setShowOptions(false);
        }
    };

    const handleTypewriterComplete = () => {
        setIsTyping(false);
        if (dialogIndex < dialogSteps.length) {
            setShowOptions(true);
        }
    };

    const handleOptionSelect = (optionText: string) => {
        addMessage('user', optionText);
        setShowOptions(false);
        const nextIndex = dialogIndex + 1;
        setDialogIndex(nextIndex);
        setTimeout(() => {
            if (nextIndex < dialogSteps.length) {
                addMessage('dispatcher', dialogSteps[nextIndex].dispatcher);
            } else {
                callEMS();
                addMessage('dispatcher', "Call ended.");
            }
        }, 800);
    };

    const isCallActive = !emsCalled && dialogIndex < dialogSteps.length;
    const currentStep = dialogSteps[dialogIndex];

    // Layout Logic
    const messagesToShow = 2; // Reduced to 2 as requested

    let currentY = 0.065; // Moved down to avoid header overlap
    const visibleMessages = messages.slice(-messagesToShow).map(msg => {
        const lines = Math.max(1, Math.ceil(msg.text.length / 18));
        const height = 0.012 + (lines * 0.009);

        const yPos = currentY;
        currentY -= (height + 0.012);

        return { ...msg, height, yPos, lines };
    });

    return (
        <group>
            {/* Header Re-added */}
            <group position={[0, 0.09, 0.01]}>
                <RoundedBox args={[0.12, 0.022, 0.001]} radius={0}>
                    <meshBasicMaterial color="#2c3e50" />
                </RoundedBox>
                <Text position={[0, 0, 0.002]} fontSize={0.008} color="white">Emergency 911</Text>
            </group>

            {/* Chat Area */}
            <group position={[0, 0, 0.01]}>
                {visibleMessages.map((msg, i) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <group key={msg.id} position={[isUser ? 0.01 : -0.01, msg.yPos, 0]}>
                            <RoundedBox
                                args={[0.09, msg.height, 0.001]}
                                radius={0.003}
                                position={[0, -msg.height / 2 + 0.006, 0]}
                            >
                                <meshStandardMaterial color={isUser ? "#dcf8c6" : "#ffffff"} />
                            </RoundedBox>
                            <group position={[-0.04, 0, 0.002]}>
                                {(!isUser && i === visibleMessages.length - 1 && isTyping) ? (
                                    <TypewriterText text={msg.text} onComplete={handleTypewriterComplete} />
                                ) : (
                                    <Text fontSize={0.007} color="black" maxWidth={0.08} anchorX="left" anchorY="top" textAlign="left">
                                        {msg.text}
                                    </Text>
                                )}
                            </group>
                        </group>
                    );
                })}
            </group>

            {/* Options Area */}
            {showOptions && isCallActive && (
                <group position={[0, -0.030, 0.015]}>
                    {currentStep.options.map((opt, i) => (
                        <TouchableButton
                            key={i}
                            text={opt}
                            position={[0, -i * 0.022, 0]}
                            width={0.10} height={0.018}
                            color="#3498db" hoverColor="#2980b9"
                            onClick={() => handleOptionSelect(opt)}
                        >
                            <Text position={[0, 0, 0.002]} fontSize={0.006} color="white" maxWidth={0.09}>{opt}</Text>
                        </TouchableButton>
                    ))}
                </group>
            )}

            {!isCallActive && (
                <TouchableButton position={[0, -0.08, 0.01]} width={0.06} height={0.025} color="#e74c3c" hoverColor="#c0392b" onClick={onHome}>
                    <Text position={[0, 0, 0.002]} fontSize={0.01} color="white">END CALL</Text>
                </TouchableButton>
            )}
        </group>
    );
}

export function VRPhone() {
    const isPhoneVisible = useStore((state) => state.isPhoneVisible);
    const togglePhone = useStore((state) => state.togglePhone);

    const [screen, setScreen] = useState<Screen>('HOME');

    useEffect(() => {
        if (!isPhoneVisible) setScreen('HOME');
    }, [isPhoneVisible]);

    const handleCall = (num: string) => {
        if (num === '112' || num === '911') {
            setScreen('CHAT');
        } else {
            setScreen('HOME');
        }
    };

    const groupRef = useRef<Group>(null);
    const rightController = useXRInputSourceState('controller', 'right');
    const rightHand = useXRInputSourceState('hand', 'right');
    const lastButtonStateRef = useRef(false);

    useEffect(() => {
        if (!rightController) return;
        const checkButton = () => {
            const gamepad = rightController.inputSource?.gamepad;
            // Button 5 is usually 'B' (or 'Y' on left)
            if (gamepad && gamepad.buttons[5]?.pressed) {
                if (!lastButtonStateRef.current) togglePhone();
                lastButtonStateRef.current = true;
            } else {
                lastButtonStateRef.current = false;
            }
        };
        const interval = setInterval(checkButton, 50);
        return () => clearInterval(interval);
    }, [rightController, togglePhone]);

    const inputSource = rightHand || rightController;

    useFrame(() => {
        if (groupRef.current && inputSource?.object && isPhoneVisible) {
            inputSource.object.matrixWorld.decompose(groupRef.current.position, groupRef.current.quaternion, new Vector3());
            const offset = new Vector3(0, 0.05, 0);
            offset.applyQuaternion(groupRef.current.quaternion);
            groupRef.current.position.add(offset);

            const tilt = new Quaternion();
            tilt.setFromEuler(new Euler(-Math.PI / 2, 0, 0));
            groupRef.current.quaternion.multiply(tilt);
        }
    });

    if (!isPhoneVisible || !inputSource) return null;

    const phoneWidth = 0.12;
    const phoneHeight = 0.22;

    return (
        <group ref={groupRef}>
            <RoundedBox args={[phoneWidth, phoneHeight, 0.015]} radius={0.008} smoothness={4}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </RoundedBox>

            <mesh position={[0, 0.01, 0.008]}>
                <planeGeometry args={[phoneWidth - 0.01, phoneHeight - 0.02]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {screen === 'HOME' && <HomeScreen onOpenApp={(app) => app === 'DIALER' && setScreen('DIALER')} />}
            {screen === 'DIALER' && <DialerScreen onCall={handleCall} onBack={() => setScreen('HOME')} />}
            {screen === 'CHAT' && <ChatScreen onHome={() => setScreen('HOME')} />}

            <group position={[0, -phoneHeight / 2 + 0.015, 0.008]} onClick={() => setScreen('HOME')}>
                <mesh position={[0, 0, 0.001]}>
                    <circleGeometry args={[0.006, 32]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
            </group>
        </group>
    );
}
